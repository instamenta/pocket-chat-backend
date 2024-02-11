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

-- Create Table Notifications:
CREATE TABLE IF NOT EXISTS "notifications"
(
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at   TIMESTAMPTZ      DEFAULT NOW(),
    type         VARCHAR(255),
    seen         BOOL,
    content      TEXT,
    sender_id    UUID,
    recipient_id UUID,
    FOREIGN KEY (sender_id) REFERENCES "users" (id),
    FOREIGN KEY (recipient_id) REFERENCES "users" (id)
);

-- Add Indexes to Notifications table:
CREATE INDEX IF NOT EXISTS idx_notifications_sender_id ON "notifications" (sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON "notifications" (recipient_id);

-- Create Enum type publication_status:
CREATE TYPE publication_status AS ENUM ('draft', 'published');

-- Create Table Publications:
CREATE TABLE IF NOT EXISTS "publications"
(
    id                 UUID PRIMARY KEY   DEFAULT uuid_generate_v4(),
    created_at         TIMESTAMPTZ        DEFAULT NOW(),
    updated_at         TIMESTAMPTZ        DEFAULT NOW(),
    publication_status publication_status DEFAULT 'draft',
    images             VARCHAR(255)[],
    description        TEXT               DEFAULT '',
    publisher_id       UUID,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    FOREIGN KEY (publisher_id) REFERENCES "users" (id)
);

-- Index for filtering or joining on publisher_id
CREATE INDEX IF NOT EXISTS idx_publications_on_publisher_id ON publications (publisher_id);

-- Index for efficiently querying by publication_status
CREATE INDEX IF NOT EXISTS idx_publications_on_publication_status ON publications (publication_status);

-- Index for sorting or querying by creation and update times
CREATE INDEX IF NOT EXISTS idx_publications_on_created_at ON publications (created_at);
CREATE INDEX IF NOT EXISTS idx_publications_on_updated_at ON publications (updated_at);

-- Create Table for Likes on Publications
CREATE TABLE IF NOT EXISTS "publication_likes"
(
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    publication_id UUID NOT NULL,
    user_id        UUID NOT NULL,
    created_at     TIMESTAMPTZ      DEFAULT NOW(),
    FOREIGN KEY (publication_id) REFERENCES "publications" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    UNIQUE (publication_id, user_id)
);

-- Add indexes for publication_likes
CREATE INDEX IF NOT EXISTS idx_publication_likes_on_publication_id ON publication_likes (publication_id);
CREATE INDEX IF NOT EXISTS idx_publication_likes_on_user_id ON publication_likes (user_id);

-- Create Table for Comments on Publications
CREATE TABLE IF NOT EXISTS "comments"
(
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content        TEXT NOT NULL,
    created_at     TIMESTAMPTZ      DEFAULT NOW(),
    publication_id UUID NOT NULL,
    user_id        UUID NOT NULL,
    FOREIGN KEY (publication_id) REFERENCES "publications" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add indexes for comments
CREATE INDEX IF NOT EXISTS idx_comments_on_publication_id ON comments (publication_id);
CREATE INDEX IF NOT EXISTS idx_comments_on_user_id ON comments (user_id);

-- Create Table for Likes on Comments
CREATE TABLE IF NOT EXISTS "comment_likes"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    FOREIGN KEY (comment_id) REFERENCES "comments" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    UNIQUE (comment_id, user_id)
);

-- Add indexes for comment_likes
CREATE INDEX IF NOT EXISTS idx_comment_likes_on_comment_id ON comment_likes (comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_on_user_id ON comment_likes (user_id);

-- Create Enum type for Story Visibility Status:
CREATE TYPE story_visibility AS ENUM ('public', 'private', 'archive');

-- Create Table Stories:
CREATE TABLE IF NOT EXISTS "stories"
(
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL,
    image_url       VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ   DEFAULT NOW(),
    visibility      story_visibility DEFAULT 'public',
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add Indexes to Stories table:
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON "stories" (user_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON "stories" (created_at);


