revoke all on function public.is_super_admin(uuid) from public, anon;
revoke all on function public.is_active_admin(uuid) from public, anon;
revoke all on function public.can_manage_content(uuid) from public, anon;
revoke all on function public.can_manage_events(uuid) from public, anon;
revoke all on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.is_super_admin(uuid) to authenticated, service_role;
grant execute on function public.is_active_admin(uuid) to authenticated, service_role;
grant execute on function public.can_manage_content(uuid) to authenticated, service_role;
grant execute on function public.can_manage_events(uuid) to authenticated, service_role;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

drop policy if exists "public read event results" on public.event_results;
create policy "public read event results" on public.event_results
for select to anon, authenticated
using (exists (
  select 1 from public.events e
  where e.id = event_results.event_id
    and (e.status = 'published'::content_status
      or (e.status = 'scheduled'::content_status and e.publish_at is not null and e.publish_at <= now()))
));

drop policy if exists "public read gallery images" on public.gallery_images;
create policy "public read gallery images" on public.gallery_images
for select to anon, authenticated
using (exists (
  select 1 from public.gallery_albums a
  where a.id = gallery_images.album_id
    and a.status = 'published'::content_status
));

drop policy if exists "public read media" on public.media_assets;
revoke select on public.media_assets from anon;

revoke select on public.team_members from anon;
grant select (id, name, position, department, academic_year, group_name, photo_url, bio, linkedin, github, sort_order, status, active, created_at, updated_at) on public.team_members to anon;