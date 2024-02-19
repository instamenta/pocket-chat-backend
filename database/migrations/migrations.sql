-- Alter table to add new Column friendship status
ALTER TABLE "friendships"
    ADD COLUMN friendship_status friendship_status DEFAULT 'pending';

-- Alter user table to add new column
ALTER TABLE "users"
    ADD COLUMN bio TEXT DEFAULT '';

-- Alter table messages to add new columns

ALTER TABLE "messages"
    ADD COLUMN images VARCHAR(255)[],
    ADD COLUMN files  VARCHAR(255)[];