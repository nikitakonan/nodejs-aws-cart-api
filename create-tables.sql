CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE carts
(
    id         UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    user_id    UUID        NOT NULL,
    created_at DATE        NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE        NOT NULL DEFAULT CURRENT_DATE,
    status     cart_status NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE cart_items
(
    product_id UUID PRIMARY KEY,
    cart_id    UUID REFERENCES carts (id) ON DELETE CASCADE,
    count      INTEGER
);

CREATE TYPE order_status AS ENUM ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');

CREATE TABLE orders
(
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id  UUID    NOT NULL,
    cart_id  UUID REFERENCES carts (id) ON DELETE CASCADE,
    payment  json,
    delivery json,
    comments TEXT,
    status   TEXT,
    total    INTEGER NOT NULL
);

CREATE TABLE users
(
    id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name     TEXT UNIQUE NOT NULL,
    email    TEXT,
    password TEXT        NOT NULL
)