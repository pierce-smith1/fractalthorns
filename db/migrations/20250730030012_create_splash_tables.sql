-- migrate:up

create table [splash] (
    [id] integer primary key,
    [text] text not null,
    [created_at] text not null,
    [ordinal] integer not null
    [source] text,
);

create table [splash_discord_detail] (
    [id] integer primary key,
    [splash_id] integer not null,
    [display_name] text not null,
    [user_id] text not null,
);

create table [splash_cursor] (
    [position] integer not null,
    [last_updated] text not null
);

-- migrate:down

drop table [splash];
drop table [splash_cursor];

