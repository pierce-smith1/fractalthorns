-- migrate:up

create table [rune] (
    [id] integer primary key,
    [name] text not null unique,
    [file_id] integer not null
);

create table [runeword] (
    [id] integer primary key,
    [name] text not null unique
);

create table [runeword_rune] (
    [id] integer primary key,
    [rune_name] text not null,
    [runeword_name] text not null,
    [ordinal] integer not null
);

-- migrate:down

drop table [rune];
drop table [runeword];
drop table [runeword_rune];

