-- Alter table to add new Column friendship status
ALTER TABLE "friendships"
    ADD COLUMN friendship_status friendship_status DEFAULT 'pending'
