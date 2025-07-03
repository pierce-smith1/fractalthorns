-- migrate:up

create table [file] (
    [id] integer primary key,
    [data] blob not null,
    [hash] text not null
);

create table [directory] (
    [id] integer primary key,
    [path] text not null,
    [modified_ms] integer not null
);

-- migrate:down

drop table [file];
drop table [directory];
