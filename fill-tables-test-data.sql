CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

INSERT INTO public.carts(id, user_id, status)
VALUES ('0cb5232d-b27b-4664-8493-a235858e4fd8', uuid_generate_v4(), 'OPEN'),
       ('50ef11d3-9bb1-4086-ad1d-3ab4e74a3e63', uuid_generate_v4(), 'ORDERED'),
       ('cba14fc7-37ec-4c76-ba92-30d0704c7a2d', uuid_generate_v4(), 'OPEN'),
       ('ef732896-adcc-4adc-a3a7-ba7e04bb4d27', uuid_generate_v4(), 'OPEN');

INSERT INTO public.cart_items(cart_id, product_id, count)
VALUES ('0cb5232d-b27b-4664-8493-a235858e4fd8', uuid_generate_v4(), 10),
       ('50ef11d3-9bb1-4086-ad1d-3ab4e74a3e63', uuid_generate_v4(), 5),
       ('50ef11d3-9bb1-4086-ad1d-3ab4e74a3e63', uuid_generate_v4(), 2),
       ('cba14fc7-37ec-4c76-ba92-30d0704c7a2d', uuid_generate_v4(), 1),
       ('ef732896-adcc-4adc-a3a7-ba7e04bb4d27', uuid_generate_v4(), 3);