import { describe, expect, it } from "vitest";
import { safeJsonParse } from "@/lib/utils";

describe("safeJsonParse", () => {
  it("returns the parsed value for valid JSON", () => {
    expect(safeJsonParse<{ a: number }>('{"a":1}', { a: 0 })).toEqual({ a: 1 });
  });

  it("returns the fallback when input is empty", () => {
    expect(safeJsonParse<number[]>(null, [])).toEqual([]);
    expect(safeJsonParse<number[]>("", [])).toEqual([]);
    expect(safeJsonParse<number[]>(undefined, [])).toEqual([]);
  });

  it("returns the fallback when JSON is malformed", () => {
    expect(safeJsonParse<{ a: number }>("{not json", { a: 99 })).toEqual({ a: 99 });
  });

  it("does not throw on prototype-pollution attempts", () => {
    // JSON.parse itself doesn't pollute Object.prototype, but we verify behaviour.
    const fallback = { ok: true };
    const out = safeJsonParse<typeof fallback>('{"__proto__":{"polluted":true}}', fallback);
    expect((Object.prototype as unknown as { polluted?: boolean }).polluted).toBeUndefined();
    expect(out).toBeTypeOf("object");
  });
});
