CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    status cart_status NOT NULL DEFAULT 'OPEN'
);

