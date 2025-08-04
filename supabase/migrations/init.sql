create role anon nologin;

create table if not exists conversation_logs (
    id uuid primary key default gen_random_uuid(),
    message text not null,
    intent text not null,
    response text not null,
    created_at timestamp with time zone default now()
    );

grant usage on schema public to anon;
grant select, insert on conversation_logs to anon;
grant select, insert (id, message, intent, response, created_at) on conversation_logs to anon;
grant execute on function gen_random_uuid() to anon;
