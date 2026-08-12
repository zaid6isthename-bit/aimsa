import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/site/PageHeader";
import { EventCard } from "@/components/site/EventCard";
import { EmptyState } from "@/components/site/EmptyState";
import { eventBucket, eventStatus, eventYears, publishedEvents } from "@/lib/content";
import type { EventCategory, EventFormat } from "@/content/types";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";

type Search = {
  q?: string;
  status?: string;
  category?: string;
  year?: string;
  format?: string;
  sort?: "nearest" | "newest";
};

const categories: EventCategory[] = [
  "Workshop",
  "Debate",
  "Hackathon",
  "Seminar",
  "Bootcamp",
  "Competition",
  "Community",
];
const formats: EventFormat[] = ["In-person", "Online", "Hybrid"];
const statuses = ["Registration Open", "Coming Soon", "Ongoing", "Completed", "Cancelled"];

export const Route = createFileRoute("/events/")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
    const out: Search = {};
    const q = str(raw["q"]);
    if (q) out.q = q;
    const status = str(raw["status"]);
    if (status) out.status = status;
    const category = str(raw["category"]);
    if (category) out.category = category;
    const year = str(raw["year"]);
    if (year) out.year = year;
    const format = str(raw["format"]);
    if (format) out.format = format;
    if (raw["sort"] === "newest") out.sort = "newest";
    return out;
  },
  head: () => ({
    meta: [
      { title: "Events — AIMSA | LTCE Navi Mumbai" },
      {
        name: "description",
        content:
          "Search and filter every AIMSA workshop, debate, hackathon and seminar at Lokmanya Tilak College of Engineering, Navi Mumbai.",
      },
      { property: "og:title", content: "AIMSA Events — workshops, debates, build weeks" },
      {
        property: "og:description",
        content: "The full AIMSA event directory with status, format and venue details.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/events/" });

  const setParam = (key: keyof Search, value?: string) =>
    navigate({
      search: (prev: Search) => ({ ...prev, [key]: value || undefined }),
      replace: true,
    });

  const results = useMemo(() => {
    const q = (search.q ?? "").trim().toLowerCase();
    let list = publishedEvents().filter((event) => {
      if (q && !`${event.title} ${event.summary} ${event.category}`.toLowerCase().includes(q)) return false;
      if (search.status && eventStatus(event) !== search.status) return false;
      if (search.category && event.category !== search.category) return false;
      if (search.format && event.format !== search.format) return false;
      if (search.year) {
        const year = event.startDate ? new Date(event.startDate).getFullYear().toString() : null;
        if (year !== search.year) return false;
      }
      return true;
    });

    list = list.sort((a, b) => {
      if (search.sort === "newest") {
        return (b.startDate ?? "").localeCompare(a.startDate ?? "");
      }
      const order = { ongoing: 0, upcoming: 1, past: 2 } as const;
      const diff = order[eventBucket(a)] - order[eventBucket(b)];
      if (diff !== 0) return diff;
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (a.startDate ?? "\uffff").localeCompare(b.startDate ?? "\uffff");
    });
    return list;
  }, [search]);

  const hasFilters = Boolean(
    search.q || search.status || search.category || search.year || search.format || search.sort,
  );

  return (
    <>
      <PageHeader
        eyebrow="Programme"
        title="AIMSA events"
        intro="Every workshop, debate, build week and seminar the association runs. Official dates and venues appear here once confirmed."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Events" }]}
      />

      <section className="relative isolate overflow-hidden">
        <ArtBackdrop image={bgFor("events:list")} position="center 45%" />
        <div className="container-aimsa section-y">
        <div className="surface-card grid gap-4 p-5 lg:grid-cols-[1.4fr_repeat(4,0.9fr)] lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="event-search">Search events</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="event-search"
                type="search"
                value={search.q ?? ""}
                placeholder="Title or keyword"
                className="pl-9"
                onChange={(e) => setParam("q", e.target.value)}
              />
            </div>
          </div>

          <FilterSelect
            id="filter-status"
            label="Status"
            value={search.status ?? ""}
            options={statuses}
            onChange={(v) => setParam("status", v)}
          />
          <FilterSelect
            id="filter-category"
            label="Category"
            value={search.category ?? ""}
            options={categories}
            onChange={(v) => setParam("category", v)}
          />
          <FilterSelect
            id="filter-format"
            label="Format"
            value={search.format ?? ""}
            options={formats}
            onChange={(v) => setParam("format", v)}
          />
          <FilterSelect
            id="filter-year"
            label="Year"
            value={search.year ?? ""}
            options={eventYears()}
            onChange={(v) => setParam("year", v)}
            emptyLabel={eventYears().length ? "All years" : "No dated events yet"}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{results.length}</span> of{" "}
            {publishedEvents().length} events
          </p>
          <div className="flex items-center gap-2">
            <FilterSelect
              id="filter-sort"
              label="Sort"
              inline
              value={search.sort ?? ""}
              options={["newest"]}
              optionLabels={{ newest: "Newest / past first" }}
              emptyLabel="Nearest first"
              onChange={(v) => setParam("sort", v)}
            />
            {hasFilters ? (
              <Button
                variant="quiet"
                size="sm"
                onClick={() => navigate({ search: {}, replace: true })}
              >
                <X aria-hidden="true" /> Reset filters
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          {results.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results.map((event) => (
                <EventCard key={event.slug} event={event} featured={event.featured ?? false} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No events match these filters"
              description="AIMSA's programme is active — this combination of filters just has no matches. Try widening the status or category, or reset the filters."
              action={
                <Button variant="hero" onClick={() => navigate({ search: {}, replace: true })}>
                  Reset filters
                </Button>
              }
            />
          )}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Want to propose a session?{" "}
          <Link to="/contact" className="text-primary underline underline-offset-4">
            Contact the team
          </Link>
          .
        </p>
        </div>
      </section>
    </>
  );
}

function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
  emptyLabel,
  optionLabels,
  inline = false,
}: {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  emptyLabel?: string;
  optionLabels?: Record<string, string>;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "flex items-center gap-2" : "space-y-2"}>
      <Label htmlFor={id} className={inline ? "text-sm text-muted-foreground" : ""}>
        {label}
      </Label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={options.length === 0}
        className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      >
        <option value="">{emptyLabel ?? `All ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {optionLabels?.[o] ?? o}
          </option>
        ))}
      </select>
    </div>
  );
}
