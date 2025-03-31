CREATE TABLE cart_items
(
    product_id UUID PRIMARY KEY,
    cart_id    UUID REFERENCES carts (id) ON DELETE CASCADE,
    count      INTEGER
);