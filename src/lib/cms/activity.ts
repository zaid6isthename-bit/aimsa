import { supabase } from "@/integrations/supabase/client";

export async function logActivity(input: {
  action: string;
  entity: string;
  entityLabel?: string | undefined;
  entityId?: string | undefined;
  actorName: string;
}) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("activity_log").insert({
    actor_id: data.user.id,
    actor_name: input.actorName,
    action: input.action,
    entity: input.entity,
    entity_label: input.entityLabel ?? null,
    entity_id: input.entityId ?? null,
  });
}