-- migrate:up

create table [api_key] (
    [id] integer primary key,
    [key] text not null,
    [subject_name] text not null
);

-- migrate:down

drop table [api_key];
