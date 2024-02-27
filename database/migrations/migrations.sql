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