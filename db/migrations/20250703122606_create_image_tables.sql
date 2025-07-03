-- migrate:up

create table [image] (
    [id] integer primary key,
    [name] text not null,
    [title] text not null,
    [date] text not null,
    [canon] text,
    [speedpaint_url] text,
    [ordinal] integer not null,
    [file_id] integer not null,
    [thumbnail_file_id] integer not null,
    [description] text,
    [characters] text,
    [primary_color] text,
    [secondary_color] text
);

-- migrate:down

drop table [image];
