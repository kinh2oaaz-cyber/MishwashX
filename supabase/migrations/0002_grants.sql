-- Supabase's default privileges were not applied when the schema was pushed.
-- Restore the standard role grants so the anon key can read published content,
-- authenticated editors can write, and the service role can manage the data.
-- Row Level Security still governs which rows each role can access.

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant execute on all functions in schema public to anon, authenticated, service_role;
