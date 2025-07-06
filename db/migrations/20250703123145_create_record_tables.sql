-- migrate:up

create table [record] (
    [id] integer primary key,
    [name] text not null unique,
    [title] text not null,
    [canon] text not null,
    [chapter] text not null,
    [ordinal] integer not null,
    [requested] integer not null,
    [languages] text not null,
    [characters] text not null,
    [format] text,
    [always_discovered] integer not null
);

create table [record_line] (
    [id] integer primary key,
    [record_id] integer not null,
    [type] text not null,
    [character] text,
    [language] text,
    [emphasis] text,
    [text] text not null,
    [ordinal] integer not null
);

create table [record_header_line] (
    [id] integer primary key,
    [record_id] integer not null,
    [text] text not null,
    [ordinal] integer not null
);

-- migrate:down

drop table [record];
drop table [record_line];
drop table [record_header_line];
