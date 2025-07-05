-- migrate:up

create table [news] (
    [id] integer primary key,
    [title] text not null,
    [date] text not null,
    [version] text
);

create table [news_item] (
    [id] integer primary key,
    [news_id] integer not null,
    [text] text not null
);

-- migrate:down

drop table [news];
drop table [news_item];
