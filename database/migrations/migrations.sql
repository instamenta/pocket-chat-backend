-- Alter table to add new Column friendship status
ALTER TABLE "friendships"
    ADD COLUMN IF NOT EXISTS friendship_status friendship_status DEFAULT 'pending';

-- Alter user table to add new column
ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';

-- Alter table messages to add new columns
ALTER TABLE "messages"
    ADD COLUMN IF NOT EXISTS images VARCHAR(255)[],
    ADD COLUMN IF NOT EXISTS files  VARCHAR(255)[];

-- Alter table publications to add new columns for group id
ALTER TABLE "publications"
    ADD COLUMN IF NOT EXISTS group_id UUID;

-- Alter table publications to add new constrain for group id foreign key
ALTER TABLE "publications"
    ADD CONSTRAINT fk_publications_group_id
        FOREIGN KEY (group_id) REFERENCES "groups" (id);

-- Alter table groups to add new column
ALTER TABLE "groups"
    ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Alter table lives messages to add new column
ALTER TABLE "lives_messages"
    ADD COLUMN IF NOT EXISTS content TEXT;

-- Alter table lives messages to add remove new column
ALTER TABLE "lives"
    DROP COLUMN IF EXISTS content;

-- Alter table notifications to add new column
ALTER TABLE "notifications"
    ADD COLUMN IF NOT EXISTS reference_id UUID;

-- Alter table shorts to add new columns for likes_count
ALTER TABLE "shorts"
    ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

-- Alter table shorts to add new columns for comments_count
ALTER TABLE "shorts"
    ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0;

-- Alter table stories to add new columns for likes_count
ALTER TABLE "stories"
    ADD COLUMN IF NOT EXISTS likes_count INT DEFAULT 0;

-- Alter table stories to add new columns for comments_count
ALTER TABLE "stories"
    ADD COLUMN IF NOT EXISTS comments_count INT DEFAULT 0;


--- Alter the delete behaviour on the Short associated tables
BEGIN;

-- Update foreign keys for short_comments to support cascading deletes
ALTER TABLE "short_comments" DROP CONSTRAINT IF EXISTS "short_comments_short_id_fkey";
ALTER TABLE "short_comments" ADD CONSTRAINT "short_comments_short_id_fkey"
    FOREIGN KEY (short_id) REFERENCES "shorts" (id) ON DELETE CASCADE;

-- Update foreign keys for short_comment_likes to support cascading deletes
ALTER TABLE "short_comment_likes" DROP CONSTRAINT IF EXISTS "short_comment_likes_comment_id_fkey";
ALTER TABLE "short_comment_likes" ADD CONSTRAINT "short_comment_likes_comment_id_fkey"
    FOREIGN KEY (comment_id) REFERENCES "short_comments" (id) ON DELETE CASCADE;

COMMIT;

--  TODO Add delete behaviour for all other tables where necessary