
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_active_admin(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_manage_content(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_manage_events(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM anon;

CREATE POLICY "admins read media objects" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_events(auth.uid()));
CREATE POLICY "admins upload media objects" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.can_manage_events(auth.uid()));
CREATE POLICY "admins update media objects" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_events(auth.uid()));
CREATE POLICY "admins delete media objects" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.can_manage_events(auth.uid()));
