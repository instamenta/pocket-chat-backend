--- Create UUID Extension:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


--- Create Table Users:
CREATE TABLE IF NOT EXISTS "users"
(
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username       VARCHAR(255) UNIQUE,
    email          VARCHAR(255) UNIQUE,
    password       VARCHAR(255),
    first_name     VARCHAR(255),
    last_name      VARCHAR(255),
    picture        VARCHAR(255)     DEFAULT 'https://openseauserdata.com/files/3d825b936774e0ae3c8247613c91d436.png',
    created_at     TIMESTAMPTZ      DEFAULT NOW(),
    updated_at     TIMESTAMPTZ      DEFAULT NOW(),
    last_active_at TIMESTAMPTZ      DEFAULT NOW()
);

-- Add Indexes to Users table:
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON "users" (username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON "users" (email);

-- Create Enum type friendship_status:
CREATE TYPE friendship_status AS ENUM ('accepted', 'pending');

-- Create Table Friendships:
CREATE TABLE IF NOT EXISTS "friendships"
(
    id                UUID PRIMARY KEY  DEFAULT uuid_generate_v4(),
    created_at        TIMESTAMPTZ       DEFAULT NOW(),
    sender_id         UUID,
    recipient_id      UUID,
    friendship_status friendship_status DEFAULT 'pending',
    FOREIGN KEY (sender_id) REFERENCES "users" (id),
    FOREIGN KEY (recipient_id) REFERENCES "users" (id)
);

-- Add Indexes to Friendships table:
CREATE INDEX IF NOT EXISTS idx_friendships_sender_id ON "friendships" (sender_id);
CREATE INDEX IF NOT EXISTS idx_friendships_recipient_id ON "friendships" (recipient_id);


-- Create Enum type message_status:
CREATE TYPE message_status AS ENUM ('seen', 'sent', 'pending');

-- Create Table Messages:
CREATE TABLE IF NOT EXISTS "messages"
(
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content        TEXT,
    message_status message_status   DEFAULT 'pending',
    updated_at     TIMESTAMPTZ      DEFAULT NOW(),
    created_at     TIMESTAMPTZ      DEFAULT NOW(),
    edited         BOOL             DEFAULT false,
    sender_id      UUID,
    recipient_id   UUID,
    friendship_id  UUID,
    FOREIGN KEY (sender_id) REFERENCES "users" (id),
    FOREIGN KEY (recipient_id) REFERENCES "users" (id),
    FOREIGN KEY (friendship_id) REFERENCES "friendships" (id)
);

-- Add Indexes to Messages table:
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON "messages" (sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON "messages" (recipient_id);


