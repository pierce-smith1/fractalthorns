-- migrate:up

create table [puzzle] (
    [id] integer primary key,
    [name] text not null,
    [chapter] text not null,
    [solve_behavior] text not null,
    [solve_code] text not null,
    [primary_color] text,
    [secondary_color] text,
    [type] text not null,
    [ordinal] integer not null
);

create table [puzzle_linked_record] (
    [id] integer primary key,
    [puzzle_id] integer not null,
    [record_name] text not null
);

create table [puzzle_solve] (
    [id] integer primary key,
    [puzzle_id] integer not null,
    [record_id] integer not null
);

-- migrate:down

drop table [puzzle];
drop table [puzzle_linked_record];
drop table [puzzle_solve];

