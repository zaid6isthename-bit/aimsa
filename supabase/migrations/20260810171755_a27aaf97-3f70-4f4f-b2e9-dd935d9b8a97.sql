
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('super_admin','content_admin','event_admin');
CREATE TYPE public.content_status AS ENUM ('draft','published','scheduled','archived');
CREATE TYPE public.event_state AS ENUM ('upcoming','ongoing','completed','cancelled');

-- UPDATED_AT HELPER
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ADMIN PROFILES
CREATE TABLE public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_profiles TO authenticated;
GRANT ALL ON public.admin_profiles TO service_role;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_active_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_profiles WHERE id = _user_id AND active);
$$;

-- can manage general content (everything except admin management)
CREATE OR REPLACE FUNCTION public.can_manage_content(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_active_admin(_user_id)
    AND (public.has_role(_user_id,'super_admin') OR public.has_role(_user_id,'content_admin'));
$$;

-- can manage events (content admins + event admins + super admins)
CREATE OR REPLACE FUNCTION public.can_manage_events(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_active_admin(_user_id)
    AND (public.has_role(_user_id,'super_admin')
      OR public.has_role(_user_id,'content_admin')
      OR public.has_role(_user_id,'event_admin'));
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_active_admin(_user_id) AND public.has_role(_user_id,'super_admin');
$$;

CREATE POLICY "admins read admin profiles" ON public.admin_profiles
  FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "super admins manage admin profiles" ON public.admin_profiles
  FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE TRIGGER admin_profiles_updated BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "super admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- MEDIA ASSETS
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  alt_text TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT SELECT ON public.media_assets TO anon;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read media" ON public.media_assets FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage media" ON public.media_assets FOR ALL TO authenticated
  USING (public.can_manage_events(auth.uid())) WITH CHECK (public.can_manage_events(auth.uid()));
CREATE TRIGGER media_assets_updated BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- EVENTS
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Workshop',
  format TEXT NOT NULL DEFAULT 'In-person',
  state public.event_state NOT NULL DEFAULT 'upcoming',
  status public.content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  venue TEXT,
  registration_url TEXT,
  registration_deadline TIMESTAMPTZ,
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  organizers TEXT[] NOT NULL DEFAULT '{}',
  rules TEXT[] NOT NULL DEFAULT '{}',
  agenda JSONB NOT NULL DEFAULT '[]'::jsonb,
  resources JSONB NOT NULL DEFAULT '[]'::jsonb,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  poster_url TEXT,
  banner_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published events" ON public.events FOR SELECT TO anon, authenticated
  USING (status = 'published' OR (status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= now()));
CREATE POLICY "admins read all events" ON public.events FOR SELECT TO authenticated
  USING (public.can_manage_events(auth.uid()));
CREATE POLICY "admins manage events" ON public.events FOR ALL TO authenticated
  USING (public.can_manage_events(auth.uid())) WITH CHECK (public.can_manage_events(auth.uid()));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- EVENT RESULTS
CREATE TABLE public.event_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  participant TEXT NOT NULL,
  detail TEXT,
  certificate_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_results TO authenticated;
GRANT SELECT ON public.event_results TO anon;
GRANT ALL ON public.event_results TO service_role;
ALTER TABLE public.event_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read event results" ON public.event_results FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage event results" ON public.event_results FOR ALL TO authenticated
  USING (public.can_manage_events(auth.uid())) WITH CHECK (public.can_manage_events(auth.uid()));
CREATE TRIGGER event_results_updated BEFORE UPDATE ON public.event_results FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ANNOUNCEMENTS
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  status public.content_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  pinned BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  cta_label TEXT,
  cta_href TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT SELECT ON public.announcements TO anon;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published announcements" ON public.announcements FOR SELECT TO anon, authenticated
  USING ((status = 'published' OR (status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= now()))
    AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "admins read all announcements" ON public.announcements FOR SELECT TO authenticated
  USING (public.can_manage_content(auth.uid()));
CREATE POLICY "admins manage announcements" ON public.announcements FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));
CREATE TRIGGER announcements_updated BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TEAM MEMBERS
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  academic_year TEXT,
  group_name TEXT NOT NULL DEFAULT 'Office Bearers',
  photo_url TEXT,
  bio TEXT,
  linkedin TEXT,
  github TEXT,
  email TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT SELECT ON public.team_members TO anon;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published team" ON public.team_members FOR SELECT TO anon, authenticated
  USING (status = 'published' AND active);
CREATE POLICY "admins read all team" ON public.team_members FOR SELECT TO authenticated
  USING (public.can_manage_content(auth.uid()));
CREATE POLICY "admins manage team" ON public.team_members FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));
CREATE TRIGGER team_members_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROJECTS
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  description TEXT,
  domain TEXT NOT NULL DEFAULT 'Machine Learning',
  stage TEXT NOT NULL DEFAULT 'Concept',
  year TEXT,
  stack TEXT[] NOT NULL DEFAULT '{}',
  builders TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  repo_url TEXT,
  demo_url TEXT,
  writeup_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT ON public.projects TO anon;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published projects" ON public.projects FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "admins read all projects" ON public.projects FOR SELECT TO authenticated
  USING (public.can_manage_content(auth.uid()));
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));
CREATE TRIGGER projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  achieved_on DATE,
  year TEXT,
  competition TEXT,
  participants TEXT[] NOT NULL DEFAULT '{}',
  position TEXT,
  category TEXT NOT NULL DEFAULT 'Competition',
  image_url TEXT,
  evidence_url TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT SELECT ON public.achievements TO anon;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published achievements" ON public.achievements FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "admins read all achievements" ON public.achievements FOR SELECT TO authenticated
  USING (public.can_manage_content(auth.uid()));
CREATE POLICY "admins manage achievements" ON public.achievements FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));
CREATE TRIGGER achievements_updated BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- GALLERY
CREATE TABLE public.gallery_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year TEXT,
  category TEXT NOT NULL DEFAULT 'Event',
  description TEXT,
  cover_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status public.content_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT SELECT ON public.gallery_albums TO anon;
GRANT ALL ON public.gallery_albums TO service_role;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published albums" ON public.gallery_albums FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY "admins read all albums" ON public.gallery_albums FOR SELECT TO authenticated
  USING (public.can_manage_events(auth.uid()));
CREATE POLICY "admins manage albums" ON public.gallery_albums FOR ALL TO authenticated
  USING (public.can_manage_events(auth.uid())) WITH CHECK (public.can_manage_events(auth.uid()));
CREATE TRIGGER gallery_albums_updated BEFORE UPDATE ON public.gallery_albums FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  caption TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT SELECT ON public.gallery_images TO anon;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read gallery images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage gallery images" ON public.gallery_images FOR ALL TO authenticated
  USING (public.can_manage_events(auth.uid())) WITH CHECK (public.can_manage_events(auth.uid()));
CREATE TRIGGER gallery_images_updated BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SITE SETTINGS (home page copy, about, contact info, section toggles)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT SELECT ON public.site_settings TO anon;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.can_manage_content(auth.uid())) WITH CHECK (public.can_manage_content(auth.uid()));
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ACTIVITY LOG
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL DEFAULT 'Unknown',
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_label TEXT,
  entity_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read activity" ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_active_admin(auth.uid()));
CREATE POLICY "admins write activity" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (public.is_active_admin(auth.uid()) AND actor_id = auth.uid());

-- DEFAULT SETTINGS
INSERT INTO public.site_settings (key, value) VALUES
('home', '{"heroHeading":"Think Beyond. Build Ahead.","heroDescription":"AIMSA is LTCE''s student-led AI and machine learning community.","tagline":"Redefining the Future","primaryCtaLabel":"Join AIMSA","primaryCtaHref":"/join","secondaryCtaLabel":"Explore events","secondaryCtaHref":"/events","sections":{"featuredEvent":true,"stats":true,"highlights":true,"announcements":true,"projects":true,"achievements":true}}'::jsonb),
('about', '{"description":"","mission":"","vision":"","objectives":[],"history":"","values":[],"faculty":""}'::jsonb),
('contact', '{"email":"","phone":"","address":"Lokmanya Tilak College of Engineering, Sector 4, Koparkhairane, Navi Mumbai 400709","mapsUrl":"","socials":[]}'::jsonb);
