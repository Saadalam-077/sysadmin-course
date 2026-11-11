-- Systems Administration course: hashed student passwords + fixed recovery code 1234567890.
-- Function names use the sysadmin_ prefix so they don't clash with the other courses
-- that share this Supabase project. Safe to re-run.
-- Run this whole migration in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto with schema extensions;

-- Keep the existing student rows, IDs, sections, and progress intact.
alter table public.sysadmin_students
  add column if not exists password_hash text;

-- Migrate existing plaintext passwords to bcrypt hashes, then replace the old
-- plaintext values with random unusable strings. Existing student accounts remain.
update public.sysadmin_students
set password_hash = extensions.crypt(password, extensions.gen_salt('bf', 12)),
    password = encode(extensions.gen_random_bytes(32), 'hex')
where password_hash is null
  and password is not null;

-- Login is performed server-side; the browser never reads password hashes.
create or replace function public.sysadmin_student_login(
  p_student_number text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_student public.sysadmin_students%rowtype;
begin
  if p_student_number is null or p_password is null then
    return jsonb_build_object('success', false);
  end if;

  select * into v_student
  from public.sysadmin_students s
  where s.student_number = trim(p_student_number)
    and s.password_hash is not null
    and extensions.crypt(p_password, s.password_hash) = s.password_hash
  limit 1;

  if not found then
    return jsonb_build_object('success', false);
  end if;

  return jsonb_build_object(
    'success', true,
    'id', v_student.id,
    'student_name', v_student.student_name,
    'student_number', v_student.student_number,
    'section_number', v_student.section_number,
    'progress', coalesce(v_student.progress, '{}'::jsonb),
    'total_score', v_student.total_score,
    'overall_grade', v_student.overall_grade,
    'registered_at', v_student.registered_at
  );
end;
$$;

-- New student registration uses the same password hashing scheme.
create or replace function public.sysadmin_register_student(
  p_student_name text,
  p_student_number text,
  p_section_number text,
  p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_student public.sysadmin_students%rowtype;
begin
  if length(trim(coalesce(p_student_name, ''))) = 0
     or coalesce(p_student_number, '') !~ '^[0-9]{8}$'
     or length(coalesce(p_password, '')) < 8 then
    return jsonb_build_object('success', false);
  end if;

  if exists (select 1 from public.sysadmin_students where student_number = trim(p_student_number)) then
    return jsonb_build_object('success', false);
  end if;

  insert into public.sysadmin_students (
    student_name, student_number, section_number, password, password_hash, progress,
    total_score, overall_grade
  ) values (
    trim(p_student_name), trim(p_student_number), p_section_number,
    encode(extensions.gen_random_bytes(32), 'hex'),
    extensions.crypt(p_password, extensions.gen_salt('bf', 12)),
    '{}'::jsonb,
    0, 'N/A'
  )
  returning * into v_student;

  return jsonb_build_object(
    'success', true,
    'student', jsonb_build_object(
      'id', v_student.id,
      'student_name', v_student.student_name,
      'student_number', v_student.student_number,
      'section_number', v_student.section_number,
      'progress', coalesce(v_student.progress, '{}'::jsonb),
      'registered_at', v_student.registered_at
    )
  );
exception when unique_violation then
  return jsonb_build_object('success', false);
end;
$$;

-- Fixed recovery code for all students: 1234567890 (reusable, not consumed).
create or replace function public.sysadmin_reset_student_password(
  p_student_number text,
  p_recovery_code text,
  p_new_password text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_student_id public.sysadmin_students.id%type;
begin
  if p_student_number is null
     or p_recovery_code is null
     or length(coalesce(p_new_password, '')) < 8 then
    return false;
  end if;

  select id into v_student_id
  from public.sysadmin_students
  where student_number = trim(p_student_number)
    and trim(p_recovery_code) = '1234567890'
  for update;

  if not found then
    return false;
  end if;

  update public.sysadmin_students
  set password_hash = extensions.crypt(p_new_password, extensions.gen_salt('bf', 12)),
      password = encode(extensions.gen_random_bytes(32), 'hex')
  where id = v_student_id;

  return true;
end;
$$;

-- Remove direct public access to these functions' internals; expose only the RPCs.
revoke all on function public.sysadmin_student_login(text, text) from public;
revoke all on function public.sysadmin_register_student(text, text, text, text) from public;
revoke all on function public.sysadmin_reset_student_password(text, text, text) from public;
grant execute on function public.sysadmin_student_login(text, text) to anon, authenticated;
grant execute on function public.sysadmin_register_student(text, text, text, text) to anon, authenticated;

grant execute on function public.sysadmin_reset_student_password(text, text, text) to anon, authenticated;

-- Prevent browser clients from reading or changing passwords/hashes.
revoke all on table public.sysadmin_students from anon, authenticated;
grant select (id, student_name, student_number, section_number, progress,
              total_score, overall_grade, registered_at)
  on table public.sysadmin_students to anon, authenticated;
grant update (progress, total_score, overall_grade)
  on table public.sysadmin_students to anon, authenticated;
