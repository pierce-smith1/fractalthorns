-- migrate:up

create table [sketch] (
    [id] integer primary key,
    [name] text not null unique,
    [ordinal] integer not null,
    [file_id] integer not null,
    [thumbnail_file_id] integer not null,
    [characters] text,
    [primary_color] text,
    [secondary_color] text
);

-- migrate:down

drop table [sketch];

