CREATE TABLE IF NOT EXISTS leaderboard (
    platform TEXT NOT NULL,
    handle TEXT NOT NULL,
    rank INT NOT NULL,
    rating INT NOT NULL,
    change_value INT,
    solved INT,
    avatar TEXT NOT NULL DEFAULT '',
    profile_url TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (platform, handle)
);
