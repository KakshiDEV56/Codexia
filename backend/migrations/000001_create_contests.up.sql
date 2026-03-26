CREATE TABLE contests (
    platform TEXT NOT NULL,
    platform_id TEXT NOT NULL,

    name TEXT NOT NULL,
    url TEXT NOT NULL,

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration INT NOT NULL,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (platform, platform_id)
);