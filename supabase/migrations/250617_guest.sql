
alter table quiz_books
    add column user_id uuid;

create table quiz_settings (
                               key text primary key,
                               value jsonb not null,
                               description text
);

create table user_quiz_settings (
                                    user_id uuid not null references users(id) on delete cascade,
                                    key text not null,
                                    value jsonb not null,
                                    updated_at timestamptz default now(),
                                    primary key (user_id, key)
);

