-- UUID 확장 (Supabase 기본 제공이지만 명시)
create extension if not exists "uuid-ossp";

-- 퀴즈 세트 메타 정보
create table quiz_books (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  group text,
  total_quizzes integer default 0, -- 총 문제 수
  created_at timestamptz default now()
);

-- 퀴즈 항목
create table quizzes (
  id bigserial primary key,
  quiz_book_id uuid not null,
  question text not null,
  answer text not null,    -- 예: 'B' (또는 text 입력형에선 정답 문자열)
  explanation text,
  type text,               -- 예: 'choice', 'short_answer'
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 퀴즈 선택지 (choices 분리)
create table quiz_choices (
  id bigserial primary key,
  quiz_id bigint not null,
  label text not null,     -- 예: 'A', 'B', 'C', 'D'
  content text not null,   -- 예: 'MyISAM'
  sort_order integer
);

-- 퀴즈 항목 수정 시간 자동 업데이트 트리거
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on quizzes
for each row
execute procedure update_updated_at_column();

-- 사용자 테이블 (uuid로 유지)
create table users (
  id uuid primary key,
  nickname text
);

-- 풀이 기록 (재응시 가능하도록 PK 제거)
create table quiz_answers (
  id bigserial primary key,
  user_id uuid not null,
  quiz_id bigint not null,
  quiz_book_id uuid not null,
  answered text not null,
  is_correct boolean not null,
  answered_at timestamptz default now()
);

-- 즐겨찾기
create table quiz_favorites (
  user_id uuid not null,
  quiz_id bigint not null,
  primary key (user_id, quiz_id)
);

-- 오답노트
create table quiz_wrong_notes (
  user_id uuid not null,
  quiz_id bigint not null,
  note text,
  created_at timestamptz default now(),
  primary key (user_id, quiz_id)
);

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


-- RLS 설정
alter table quiz_answers enable row level security;
alter table quiz_favorites enable row level security;
alter table quiz_wrong_notes enable row level security;
alter table users enable row level security;

-- RLS 정책들
create policy "users can access own data" on users for all using (auth.uid() = id);

create policy "user reads own answers" on quiz_answers for select using (auth.uid() = user_id);

create policy "user inserts own answers" on quiz_answers for insert with check (auth.uid() = user_id);
create policy "user updates own answers" on quiz_answers for update using (auth.uid() = user_id);
create policy "user deletes own answers" on quiz_answers for delete using (auth.uid() = user_id);

create policy "user favorites own quizzes" on quiz_favorites for all using (auth.uid() = user_id);

create policy "user notes own wrong answers" on quiz_wrong_notes for all using (auth.uid() = user_id);

create policy "user notes own wrong answers"
  on quiz_wrong_notes
  for all
  using (auth.uid() = user_id);

-- 인덱스 최적화
create index on quiz_books (created_at desc);
create index on quizzes (quiz_book_id);
create index on quiz_choices (quiz_id);
create index on quiz_answers (user_id, answered_at desc);
create index on quiz_answers (quiz_book_id);
create index on quiz_wrong_notes (user_id);
create index on quiz_favorites (user_id);
