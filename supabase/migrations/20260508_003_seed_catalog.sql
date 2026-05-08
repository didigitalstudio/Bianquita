-- Unilubi Kids — Catalog seed (categories, audiences, initial 12 products)

insert into public.categories (id, label, icon, sort_order) values
  ('bodies',      'Bodies',      '✿', 10),
  ('conjuntos',   'Conjuntos',   '❋', 20),
  ('pijamas',     'Pijamas',     '☾', 30),
  ('vestidos',    'Vestidos',    '✦', 40),
  ('abrigos',     'Abrigos',     '❅', 50),
  ('remeras',     'Remeras',     '♡', 60),
  ('pantalones',  'Pantalones',  '❖', 70),
  ('accesorios',  'Accesorios',  '✧', 80)
on conflict (id) do update set label = excluded.label, icon = excluded.icon, sort_order = excluded.sort_order;

insert into public.audiences (id, label, range, sort_order) values
  ('recien-nacido', 'Recién nacido', '0–3 meses', 10),
  ('bebe',          'Bebé',          '3–24 meses', 20),
  ('nino',          'Niño/a',        '2–6 años', 30)
on conflict (id) do update set label = excluded.label, range = excluded.range, sort_order = excluded.sort_order;

insert into public.products
  (id, slug, name, category_id, audience_id, price, compare_at, description, materials, care, tags, colors, stock, img)
values
  ('p1', 'body-manga-larga-rayado', 'Body manga larga rayado',
    'bodies', 'bebe', 8900, 11500,
    'Body de algodón pima con broches a presión en la entrepierna. Suave, transpirable y perfecto para el día a día.',
    '100% algodón pima',
    'Lavar a máquina con agua fría. No usar lavandina.',
    array['nuevo','best-seller'], array['crema','salvia'],
    '{"0-3M":5,"3-6M":8,"6-12M":4,"12-18M":2}'::jsonb,
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&q=80'),

  ('p2', 'conjunto-buzo-jogger-salvia', 'Conjunto buzo + jogger salvia',
    'conjuntos', 'nino', 18500, null,
    'Conjunto de friza liviana, ideal para entretiempo. Buzo con bolsillo canguro y jogger con cintura elastizada.',
    'Algodón 80% / Poliéster 20%',
    'Lavar del revés. No planchar estampa.',
    array['best-seller'], array['salvia','terracota'],
    '{"2":3,"4":6,"6":4}'::jsonb,
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80'),

  ('p3', 'pijama-dos-piezas-estrellas', 'Pijama dos piezas estrellas',
    'pijamas', 'nino', 14200, 16900,
    'Pijama de modal con estampa de estrellitas. Remera manga larga y pantalón con puño.',
    'Modal 95% / Spandex 5%',
    'Lavar a máquina. Secar al aire.',
    array['oferta'], array['crema','rosa-viejo'],
    '{"2":2,"4":5,"6":3}'::jsonb,
    'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=800&q=80'),

  ('p4', 'vestido-boho-flores', 'Vestido boho flores',
    'vestidos', 'nino', 16900, null,
    'Vestido de viscosa fluida con estampa floral. Tira regulable en hombros.',
    'Viscosa 100%',
    'Lavar a mano preferentemente.',
    array['nuevo'], array['beige','terracota'],
    '{"2":4,"4":4,"6":2}'::jsonb,
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&q=80'),

  ('p5', 'conjunto-recien-nacido-tres-piezas', 'Conjunto recién nacido tres piezas',
    'conjuntos', 'recien-nacido', 22500, 26000,
    'Set de bienvenida: body, pantalón y gorrito. Tela super suave hipoalergénica.',
    'Algodón pima 100%',
    'Lavar con jabón neutro.',
    array['nuevo','regalo'], array['crema'],
    '{"RN":8,"0-3M":6}'::jsonb,
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80'),

  ('p6', 'campera-friza-capucha', 'Campera de friza con capucha',
    'abrigos', 'nino', 24900, null,
    'Campera con capucha forrada y cierre frontal. Bolsillos canguro.',
    'Friza pesada de algodón',
    'Lavar a máquina ciclo suave.',
    '{}'::text[], array['terracota','salvia'],
    '{"2":0,"4":3,"6":2}'::jsonb,
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'),

  ('p7', 'body-bordado-animalitos', 'Body bordado animalitos',
    'bodies', 'bebe', 9900, null,
    'Body con bordados de animalitos en el frente. Cuello americano para fácil cambio.',
    'Algodón pima 100%',
    'Lavar del revés.',
    array['best-seller'], array['crema','celeste-suave'],
    '{"3-6M":4,"6-12M":6,"12-18M":3}'::jsonb,
    'https://images.unsplash.com/photo-1503944168849-8bf86875b08e?w=800&q=80'),

  ('p8', 'gorrito-tejido-orejitas', 'Gorrito tejido orejitas',
    'accesorios', 'recien-nacido', 5500, null,
    'Gorrito tejido a mano con orejitas. Forrado en algodón.',
    'Lana merino / Forro algodón',
    'Lavar a mano agua fría.',
    array['regalo'], array['crema','beige','salvia'],
    '{"RN":12,"0-6M":8}'::jsonb,
    'https://images.unsplash.com/photo-1544487102-26142b0e4f63?w=800&q=80'),

  ('p9', 'mameluco-invierno', 'Mameluco invierno',
    'abrigos', 'bebe', 28900, 32000,
    'Mameluco enterizo de friza con cierre completo. Puños y tobillos elastizados.',
    'Friza polar',
    'Lavar a máquina.',
    array['oferta'], array['beige','terracota'],
    '{"0-6M":3,"6-12M":4,"12-18M":2}'::jsonb,
    'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=800&q=80'),

  ('p10', 'set-babitas-algodon-x3', 'Set babitas de algodón x3',
    'accesorios', 'recien-nacido', 7900, null,
    'Pack de 3 babitas con broche a presión. Lado absorbente y lado impermeable.',
    'Algodón / PUL',
    'Lavar a máquina.',
    '{}'::text[], array['crema-mix'],
    '{"Único":25}'::jsonb,
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80'),

  ('p11', 'remera-oversize-estampada', 'Remera oversize estampada',
    'remeras', 'nino', 11500, null,
    'Remera de algodón con caída oversize. Estampa minimalista al frente.',
    'Algodón jersey 100%',
    'Lavar del revés.',
    array['nuevo'], array['crema','salvia'],
    '{"2":5,"4":7,"6":5}'::jsonb,
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80'),

  ('p12', 'jogger-frizado-basico', 'Jogger frizado básico',
    'pantalones', 'nino', 13500, null,
    'Jogger de friza con cintura elastizada y cordón. Bolsillos laterales.',
    'Friza algodón',
    'Lavar del revés.',
    array['best-seller'], array['beige','terracota','salvia'],
    '{"2":6,"4":8,"6":4}'::jsonb,
    'https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=800&q=80')
on conflict (id) do nothing;
