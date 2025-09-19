-- migrate:up

alter table [image] add column [remarks] text;
alter table [sketch] add column [remarks] text;

-- migrate:down

alter table [image] drop column [remarks];
alter table [sketch] drop column [remarks];
