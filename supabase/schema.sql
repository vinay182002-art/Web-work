-- Forensic Atlas foundation schema.
-- Content rows should be created from verified academic sources; demo content is
-- kept in the client repository until it is reviewed and imported.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  university text,
  programme text,
  year integer check (year between 1 and 3),
  semester integer check (semester between 1 and 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists universities (id uuid primary key default gen_random_uuid(), name text not null unique);
create table if not exists programmes (id uuid primary key default gen_random_uuid(), university_id uuid references universities(id), name text not null);
create table if not exists years (id uuid primary key default gen_random_uuid(), number integer not null unique, title text not null);
create table if not exists semesters (id uuid primary key default gen_random_uuid(), year_id uuid not null references years(id), number integer not null, title text not null, unique(year_id, number));
create table if not exists subjects (id uuid primary key default gen_random_uuid(), semester_id uuid not null references semesters(id), slug text not null unique, title text not null, description text);
alter table years add column if not exists verification_status text not null default 'NEEDS_REVIEW';
alter table years add column if not exists source_url text;
alter table years add column if not exists source_date date;
alter table years add column if not exists curriculum_version integer not null default 1;
alter table semesters add column if not exists verification_status text not null default 'NEEDS_REVIEW';
alter table semesters add column if not exists source_url text;
alter table semesters add column if not exists source_date date;
alter table semesters add column if not exists curriculum_version integer not null default 1;
alter table subjects add column if not exists classification text not null default 'STANDARD_BSC';
alter table subjects add column if not exists verification_status text not null default 'NEEDS_REVIEW';
alter table subjects add column if not exists source_url text;
alter table subjects add column if not exists source_date date;
alter table subjects add column if not exists curriculum_version integer not null default 1;
create table if not exists units (id uuid primary key default gen_random_uuid(), subject_id uuid not null references subjects(id), title text not null, position integer not null default 0);
create table if not exists chapters (id uuid primary key default gen_random_uuid(), unit_id uuid not null references units(id), slug text not null unique, title text not null, description text, estimated_minutes integer, position integer not null default 0);
create table if not exists topics (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), title text not null, position integer not null default 0);
create table if not exists lessons (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), title text not null, status text not null default 'draft', is_demo boolean not null default false);
create table if not exists lesson_sections (id uuid primary key default gen_random_uuid(), lesson_id uuid not null references lessons(id), title text not null, body text not null, position integer not null default 0);
create table if not exists content_blocks (id uuid primary key default gen_random_uuid(), lesson_section_id uuid references lesson_sections(id) on delete cascade, block_type text not null, payload jsonb not null default '{}'::jsonb, position integer not null default 0);
create table if not exists visual_maps (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), title text not null, nodes jsonb not null default '[]'::jsonb, connections jsonb not null default '[]'::jsonb);
create table if not exists concept_relations (id uuid primary key default gen_random_uuid(), from_topic_id uuid not null references topics(id), relation text not null, to_topic_id uuid not null references topics(id), unique(from_topic_id, relation, to_topic_id));
create table if not exists glossary_terms (id uuid primary key default gen_random_uuid(), term text not null unique, definition text not null, simple_explanation text, related_terms jsonb not null default '[]'::jsonb, citation_id uuid);
create table if not exists content_versions (id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid not null, version integer not null, payload jsonb not null, change_summary text, created_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(entity_type, entity_id, version));
create table if not exists content_reviews (id uuid primary key default gen_random_uuid(), entity_type text not null, entity_id uuid not null, status text not null check (status in ('draft','review','approved','published','archived')), reviewer_id uuid references auth.users(id), notes text, reviewed_at timestamptz);
create table if not exists questions (id uuid primary key default gen_random_uuid(), lesson_id uuid references lessons(id), prompt text not null, question_type text not null default 'MCQ', subject_id uuid references subjects(id), semester_id uuid references semesters(id), year_id uuid references years(id), unit_id uuid references units(id), chapter_id uuid references chapters(id), topic_id uuid references topics(id), difficulty text not null default 'MODERATE', marks integer not null default 1, bloom_level text, exam_relevance text, content_level text, source_type text not null default 'PRACTICE_CREATED', source_reference text, explanation text, correct_answer jsonb, common_misconception text, review_status text not null default 'review', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), is_demo boolean not null default false);
create table if not exists question_options (id uuid primary key default gen_random_uuid(), question_id uuid not null references questions(id), option_text text not null, position integer not null, is_correct boolean not null default false);
create table if not exists quizzes (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), title text not null);
create table if not exists quiz_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), quiz_id uuid not null references quizzes(id), score integer not null, total integer not null, completed_at timestamptz not null default now());
create table if not exists question_attempts (id uuid primary key default gen_random_uuid(), quiz_attempt_id uuid not null references quiz_attempts(id), question_id uuid not null references questions(id), selected_option_id uuid references question_options(id), is_correct boolean not null);
create table if not exists question_bookmarks (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), question_id uuid not null references questions(id), created_at timestamptz not null default now(), unique(user_id, question_id));
create table if not exists mock_exams (id uuid primary key default gen_random_uuid(), title text not null, semester_id uuid references semesters(id), subject_id uuid references subjects(id), duration_minutes integer not null, maximum_marks integer not null, pattern jsonb not null default '{}'::jsonb, review_status text not null default 'draft');
create table if not exists mock_exam_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), mock_exam_id uuid not null references mock_exams(id), started_at timestamptz not null default now(), submitted_at timestamptz, score integer, status text not null default 'in_progress');
create table if not exists exam_answers (id uuid primary key default gen_random_uuid(), attempt_id uuid not null references mock_exam_attempts(id) on delete cascade, question_id uuid not null references questions(id), answer jsonb, marked_for_review boolean not null default false, answered_at timestamptz);
create table if not exists previous_papers (id uuid primary key default gen_random_uuid(), year integer, university text, semester text, subject text, paper_code text, exam_date date, maximum_marks integer, duration_minutes integer, paper_source text, verified_status text not null default 'practice', paper_file text);
create table if not exists previous_paper_questions (id uuid primary key default gen_random_uuid(), paper_id uuid not null references previous_papers(id) on delete cascade, question_id uuid references questions(id), question_text text not null, mapped_chapter_id uuid references chapters(id), mapped_topic_id uuid references topics(id), marks integer, question_group_id text);
create table if not exists exam_readiness (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), subject_id uuid references subjects(id), score numeric(5,2) not null default 0, breakdown jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(), unique(user_id, subject_id));
create table if not exists lab_modules (id uuid primary key default gen_random_uuid(), title text not null, subject_id uuid references subjects(id), description text);
create table if not exists lab_simulations (id uuid primary key default gen_random_uuid(), module_id uuid references lab_modules(id), title text not null, objective text not null, safety_label text not null, status text not null default 'draft');
create table if not exists lab_steps (id uuid primary key default gen_random_uuid(), simulation_id uuid references lab_simulations(id) on delete cascade, stage text not null, position integer not null default 0, prompt text not null);
create table if not exists lab_actions (id uuid primary key default gen_random_uuid(), step_id uuid references lab_steps(id) on delete cascade, action_key text not null, label text not null, consequence text);
create table if not exists lab_evidence (id uuid primary key default gen_random_uuid(), simulation_id uuid references lab_simulations(id) on delete cascade, evidence_code text not null, evidence_type text not null, location text, observation text, contamination_note text);
create table if not exists lab_observations (id uuid primary key default gen_random_uuid(), attempt_id uuid, evidence_id uuid references lab_evidence(id), body text not null);
create table if not exists lab_results (id uuid primary key default gen_random_uuid(), attempt_id uuid, result_type text not null, payload jsonb not null default '{}'::jsonb, limitations text);
create table if not exists lab_attempts (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), simulation_id uuid references lab_simulations(id), stage text not null, state jsonb not null default '{}'::jsonb, started_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table if not exists investigation_progress (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id), case_id uuid, stage text not null, score jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now());
create table if not exists investigation_mistakes (id uuid primary key default gen_random_uuid(), progress_id uuid references investigation_progress(id) on delete cascade, action_key text not null, feedback text not null);
create table if not exists hints_used (id uuid primary key default gen_random_uuid(), progress_id uuid references investigation_progress(id) on delete cascade, hint_level integer not null, used_at timestamptz not null default now());
create table if not exists flashcards (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), front text not null, back text not null);
create table if not exists flashcard_reviews (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), flashcard_id uuid not null references flashcards(id), rating integer not null, reviewed_at timestamptz not null default now());
create table if not exists practicals (id uuid primary key default gen_random_uuid(), chapter_id uuid not null references chapters(id), title text not null, objective text not null);
create table if not exists case_studies (id uuid primary key default gen_random_uuid(), chapter_id uuid references chapters(id), title text not null, sections jsonb not null default '[]'::jsonb, is_demo boolean not null default false);
create table if not exists case_files (id uuid primary key default gen_random_uuid(), title text not null, prompt text not null, is_demo boolean not null default false);
create table if not exists case_attempts (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), case_file_id uuid not null references case_files(id), response text, created_at timestamptz not null default now());
create table if not exists study_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), started_at timestamptz not null, ended_at timestamptz, mode text not null default 'university');
create table if not exists mastery_records (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), chapter_id uuid not null references chapters(id), progress numeric(5,2) not null default 0, updated_at timestamptz not null default now(), unique(user_id, chapter_id));
create table if not exists revision_items (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), chapter_id uuid not null references chapters(id), topic text, next_review_at timestamptz not null, interval_days integer not null default 1, ease_score numeric(5,2) not null default 2.5, performance numeric(5,2), review_count integer not null default 0);
create table if not exists study_plans (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), title text not null, due_at timestamptz, completed_at timestamptz);
create table if not exists notes (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), chapter_id uuid references chapters(id), body text not null, created_at timestamptz not null default now());
create table if not exists bookmarks (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), chapter_id uuid references chapters(id), created_at timestamptz not null default now(), unique(user_id, chapter_id));
create table if not exists assignments (id uuid primary key default gen_random_uuid(), title text not null, description text);
create table if not exists assignment_sessions (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), assignment_id uuid not null references assignments(id), draft text, updated_at timestamptz not null default now());
create table if not exists resources (id uuid primary key default gen_random_uuid(), title text not null, url text, source text, is_verified boolean not null default false);
create table if not exists citations (id uuid primary key default gen_random_uuid(), resource_id uuid not null references resources(id), citation_text text not null);
create table if not exists curriculum_sources (id uuid primary key default gen_random_uuid(), source_type text not null, title text not null, url text, source_date date, accessed_date date not null default current_date, university text, programme text, academic_year text, verification_status text not null default 'NEEDS_REVIEW', verified_at timestamptz, verified_by uuid references auth.users(id), notes text);
create table if not exists achievements (id uuid primary key default gen_random_uuid(), title text not null, description text not null);
create table if not exists notifications (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), title text not null, body text not null, read_at timestamptz);
create table if not exists exam_dates (id uuid primary key default gen_random_uuid(), semester_id uuid references semesters(id), title text not null, exam_at timestamptz not null);
create table if not exists study_goals (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), title text not null, target text, deadline date, progress numeric(5,2) not null default 0, status text not null default 'active', next_action text, created_at timestamptz not null default now());
create table if not exists coach_profiles (user_id uuid primary key references auth.users(id), daily_minutes integer, preferred_session_minutes integer, preferred_times jsonb not null default '[]'::jsonb, learning_preferences jsonb not null default '{}'::jsonb, academic_goal text, updated_at timestamptz not null default now());

create table if not exists learner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_session_length integer,
  preferred_learning_modes jsonb not null default '[]'::jsonb,
  preferred_study_times jsonb not null default '[]'::jsonb,
  average_session_length numeric,
  question_accuracy numeric,
  retention_score numeric,
  application_score numeric,
  reading_completion numeric,
  revision_completion numeric,
  case_performance numeric,
  viva_performance numeric,
  exam_performance numeric,
  updated_at timestamptz not null default now()
);

create table if not exists knowledge_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid,
  chapter_id uuid,
  exposure numeric not null default 0,
  understanding numeric,
  recall numeric,
  application numeric,
  retention numeric,
  confidence numeric,
  mastery numeric not null default 0,
  last_studied_at timestamptz,
  last_revised_at timestamptz,
  mistake_count integer not null default 0,
  successful_retries integer not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, topic_id, chapter_id)
);

create table if not exists recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recommendation_type text not null,
  recommendation_key text not null,
  feedback text not null check (feedback in ('helpful', 'not_helpful', 'dismissed')),
  created_at timestamptz not null default now()
);
create table if not exists ai_conversations (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id), title text, created_at timestamptz not null default now());
create table if not exists ai_messages (id uuid primary key default gen_random_uuid(), conversation_id uuid not null references ai_conversations(id), role text not null, content text not null, created_at timestamptz not null default now());
create table if not exists ai_feedback (id uuid primary key default gen_random_uuid(), conversation_id uuid references ai_conversations(id), message_id uuid references ai_messages(id), rating integer, note text, created_at timestamptz not null default now());
create table if not exists knowledge_documents (id uuid primary key default gen_random_uuid(), filename text not null, source text, author text, published_date date, content_type text, subject_id uuid references subjects(id), chapter_id uuid references chapters(id), reliability text, metadata jsonb not null default '{}'::jsonb, processing_status text not null default 'pending');
create table if not exists knowledge_chunks (id uuid primary key default gen_random_uuid(), document_id uuid not null references knowledge_documents(id), page_number integer, section_heading text, chapter_id uuid references chapters(id), topic_id uuid references topics(id), content text not null, embedding_metadata jsonb not null default '{}'::jsonb);

-- Protect student-owned records. Content publishing and administration should use
-- a separate server-side role; clients only receive rows allowed by these policies.
alter table profiles enable row level security;
drop policy if exists "Users can read their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can read their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'quiz_attempts', 'question_bookmarks', 'mock_exam_attempts', 'exam_readiness',
    'lab_attempts', 'investigation_progress', 'flashcard_reviews', 'case_attempts',
    'study_sessions', 'mastery_records', 'revision_items', 'study_plans', 'notes',
    'bookmarks', 'assignment_sessions', 'notifications', 'study_goals', 'coach_profiles',
    'learner_profiles', 'knowledge_states', 'recommendation_feedback',
    'ai_conversations'
  ] loop
    execute format('alter table %I enable row level security', table_name);
    execute format('drop policy if exists %I on %I', 'Users can access their own ' || table_name, table_name);
    execute format(
      'create policy "Users can access their own %1$s" on %1$I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      table_name
    );
  end loop;
end $$;

alter table ai_messages enable row level security;
drop policy if exists "Users can access messages in their conversations" on ai_messages;
create policy "Users can access messages in their conversations" on ai_messages
  for all using (
    exists (
      select 1 from ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
        and ai_conversations.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from ai_conversations
      where ai_conversations.id = ai_messages.conversation_id
        and ai_conversations.user_id = auth.uid()
    )
  );

alter table ai_feedback enable row level security;
drop policy if exists "Users can access feedback in their conversations" on ai_feedback;
create policy "Users can access feedback in their conversations" on ai_feedback
  for all using (
    exists (
      select 1 from ai_conversations
      where ai_conversations.id = ai_feedback.conversation_id
        and ai_conversations.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from ai_conversations
      where ai_conversations.id = ai_feedback.conversation_id
        and ai_conversations.user_id = auth.uid()
    )
  );
