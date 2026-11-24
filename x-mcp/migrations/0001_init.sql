-- Connected X accounts. Tokens are AES-GCM encrypted with APP_SECRET.
CREATE TABLE accounts (
  x_user_id      TEXT PRIMARY KEY,
  username       TEXT NOT NULL,
  name           TEXT NOT NULL,
  access_token   TEXT NOT NULL,
  refresh_token  TEXT,
  expires_at     INTEGER NOT NULL,          -- unix ms
  created_at     INTEGER NOT NULL
);

-- Posts and threads waiting to go out.
CREATE TABLE scheduled (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id  TEXT NOT NULL,
  posts       TEXT NOT NULL,                -- JSON: [{ "text": "...", "images": ["name"] }]
  run_at      INTEGER NOT NULL,             -- unix ms
  status      TEXT NOT NULL DEFAULT 'pending', -- pending | sending | sent | failed | cancelled
  error       TEXT,
  result      TEXT,                         -- JSON: posted ids
  created_at  INTEGER NOT NULL
);
CREATE INDEX scheduled_due ON scheduled (status, run_at);

-- Everything published through this server.
CREATE TABLE history (
  tweet_id      TEXT PRIMARY KEY,
  account_id    TEXT NOT NULL,
  username      TEXT NOT NULL,
  text          TEXT NOT NULL,
  thread_root   TEXT,                       -- first tweet id of the thread, if part of one
  scheduled_id  INTEGER,
  posted_at     INTEGER NOT NULL,
  deleted_at    INTEGER
);
CREATE INDEX history_posted ON history (posted_at DESC);

-- Saved images, referenced by name. Files live in R2 under the same key.
CREATE TABLE images (
  name          TEXT PRIMARY KEY,
  content_type  TEXT NOT NULL,
  size          INTEGER NOT NULL,
  created_at    INTEGER NOT NULL
);
