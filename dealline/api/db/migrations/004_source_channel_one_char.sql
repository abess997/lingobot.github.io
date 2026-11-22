-- 003 documents "x" as a lead source channel, but its check required 2+ characters, so X leads were rejected.
-- Relax to 1-30 characters (the API validation was changed to match).
alter table leads drop constraint leads_source_channel_check;
alter table leads add constraint leads_source_channel_check check (source_channel ~ '^[a-z0-9_-]{1,30}$');
