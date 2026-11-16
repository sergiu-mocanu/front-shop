-- Milestone 1: the catalogue, imported from the former public/data/products.json.
-- `id` is left out: Postgres generates a uuid for each row. The old readable id becomes `slug`.
-- Run once, after 01-schema.sql.

insert into products (slug, name, category, description, image_url, price, in_stock, badge) values
  ('lampe-aria', 'Lampe Aria', 'Lumière',
   'Une lumière douce, un pied sculptural en céramique.',
   'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85',
   129, true, 'Coup de cœur'),
  ('vase-sillage', 'Vase Sillage', 'Décoration',
   'Grès façonné à la main, chaque pièce est unique.',
   'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85',
   58, true, 'Fait main'),
  ('tasse-atelier', 'Tasse Atelier', 'Art de la table',
   'Une anse généreuse et un émail vert profond.',
   'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
   24, true, null),
  ('plaid-nuage', 'Plaid Nuage', 'Textile',
   'Coton recyclé tissé dans les Hauts-de-France.',
   'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
   89, true, null),
  ('plateau-ligne', 'Plateau Ligne', 'Accessoires',
   'Du chêne certifié, des lignes simples et durables.',
   'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85',
   46, true, 'Nouveau'),
  ('bougie-empreinte', 'Bougie Empreinte', 'Parfum',
   'Cire végétale, parfum de figuier et de bois blond.',
   'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85',
   32, false, null),
  ('carafe-rosee', 'Carafe Rosée', 'Art de la table',
   'Verre soufflé à la bouche, une teinte rosée qui capte la lumière.',
   'https://images.unsplash.com/photo-1589807502973-c7be2ee95d99?auto=format&fit=crop&w=900&q=85',
   42, true, 'Nouveau');
