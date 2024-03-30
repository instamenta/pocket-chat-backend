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
    bio            TEXT             DEFAULT '',
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
    images         VARCHAR(255)[],
    files          VARCHAR(255)[],
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
    seen         BOOL             DEFAULT false,
    content      TEXT,
    sender_id    UUID,
    recipient_id UUID,
    reference_id UUID,
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
    likes_count        INT                DEFAULT 0,
    comments_count     INT                DEFAULT 0,
    group_id           UUID,
    FOREIGN KEY (group_id) REFERENCES "groups" (id),
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
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID         NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    visibility story_visibility DEFAULT 'public',
    likes_count    INT              DEFAULT 0,
    comments_count INT              DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add Indexes to Stories table:
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON "stories" (user_id);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON "stories" (created_at);

-- Create Table for Likes on stories
CREATE TABLE IF NOT EXISTS "story_likes"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id   UUID NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    FOREIGN KEY (story_id) REFERENCES "stories" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    UNIQUE (story_id, user_id)
);

-- Add indexes for story_likes
CREATE INDEX IF NOT EXISTS idx_story_likes_on_story_id ON story_likes (story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_on_user_id ON story_likes (user_id);

-- Create Table for Comments on stories
CREATE TABLE IF NOT EXISTS "story_comments"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    story_id   UUID NOT NULL,
    user_id    UUID NOT NULL,
    FOREIGN KEY (story_id) REFERENCES "stories" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add indexes for story_comments
CREATE INDEX IF NOT EXISTS idx_story_comments_on_story_id ON story_comments (story_id);
CREATE INDEX IF NOT EXISTS idx_story_comments_on_user_id ON story_comments (user_id);

-- Create Table for Likes on Comments
CREATE TABLE IF NOT EXISTS "story_comment_likes"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    FOREIGN KEY (comment_id) REFERENCES "story_comments" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    UNIQUE (comment_id, user_id)
);

-- Add indexes for story_comment_likes
CREATE INDEX IF NOT EXISTS idx_story_comment_likes_on_comment_id ON story_comment_likes (comment_id);
CREATE INDEX IF NOT EXISTS idx_story_comment_likes_on_user_id ON story_comment_likes (user_id);

-- Create Table Shorts:
CREATE TABLE IF NOT EXISTS "shorts"
(
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID         NOT NULL,
    video_url      VARCHAR(255) NOT NULL,
    description    TEXT             DEFAULT '',
    created_at     TIMESTAMPTZ      DEFAULT NOW(),
    likes_count    INT              DEFAULT 0,
    comments_count INT              DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Create Table for Likes on Shorts
CREATE TABLE IF NOT EXISTS "short_likes"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    short_id   UUID NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    FOREIGN KEY (short_id) REFERENCES "shorts" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    UNIQUE (short_id, user_id)
);

-- Add indexes for short_likes
CREATE INDEX IF NOT EXISTS idx_short_likes_on_short_id ON short_likes (short_id);
CREATE INDEX IF NOT EXISTS idx_short_likes_on_user_id ON short_likes (user_id);

-- Create Table for Comments on Shorts
CREATE TABLE IF NOT EXISTS "short_comments"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    short_id   UUID NOT NULL,
    user_id    UUID NOT NULL,
    FOREIGN KEY (short_id) REFERENCES "shorts" (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add indexes for short_comments
CREATE INDEX IF NOT EXISTS idx_short_comments_on_short_id ON short_comments (short_id);
CREATE INDEX IF NOT EXISTS idx_short_comments_on_user_id ON short_comments (user_id);

-- Create Table for Likes on Comments
CREATE TABLE IF NOT EXISTS "short_comment_likes"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL,
    user_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    FOREIGN KEY (comment_id) REFERENCES "short_comments" (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES "users" (id),
    UNIQUE (comment_id, user_id)
);

-- Add indexes for short_comment_likes
CREATE INDEX IF NOT EXISTS idx_short_comment_likes_on_comment_id ON short_comment_likes (comment_id);
CREATE INDEX IF NOT EXISTS idx_short_comment_likes_on_user_id ON short_comment_likes (user_id);

-- Create Table Groups:
CREATE TABLE IF NOT EXISTS "groups"
(
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id      UUID         NOT NULL,
    name          VARCHAR(255) NOT NULL,
    description   TEXT             DEFAULT '',
    created_at    TIMESTAMPTZ      DEFAULT NOW(),
    members_count INT8             DEFAULT 1,
    image_url     VARCHAR(255) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES "users" (id)
);

-- Create Enum type for Group Roles:
CREATE TYPE group_roles AS ENUM ('owner', 'moderator', 'member');

-- Create Table Group Members
CREATE TABLE IF NOT EXISTS "group_members"
(
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id     UUID NOT NULL,
    user_id      UUID NOT NULL,
    member_since TIMESTAMPTZ      DEFAULT NOW(),
    role         group_roles      DEFAULT 'member',
    FOREIGN KEY (group_id) REFERENCES "groups" (id),
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add Indexes to Group Members table:
CREATE INDEX IF NOT EXISTS idx_member_group_id ON "group_members" (group_id);
CREATE INDEX IF NOT EXISTS idx_member_id ON "group_members" (user_id);

-- Create Enum type for Live States:
CREATE TYPE live_state AS ENUM ('active', 'paused', 'ended');

-- Create Table Lives:
CREATE TABLE IF NOT EXISTS "lives"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    state      live_state       DEFAULT 'active',
    FOREIGN KEY (user_id) REFERENCES "users" (id)
);

-- Add Indexes to Lives table:
CREATE INDEX IF NOT EXISTS idx_user_id ON "lives" (user_id);

-- Create Table Lives Messages:
CREATE TABLE IF NOT EXISTS "lives_messages"
(
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id  UUID NOT NULL,
    live_id    UUID NOT NULL,
    created_at TIMESTAMPTZ      DEFAULT NOW(),
    content    TEXT,
    FOREIGN KEY (sender_id) REFERENCES "users" (id),
    FOREIGN KEY (live_id) REFERENCES "lives" (id)
);

-- Add Indexes to Lives Messages table:
CREATE INDEX IF NOT EXISTS idx_live_id ON "lives_messages" (live_id);