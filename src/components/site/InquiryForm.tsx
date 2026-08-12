import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { submitInquiry } from "@/lib/inquiries.functions";

const clientSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  department: z.string().trim().optional(),
  year: z.string().trim().optional(),
  interest: z.string().trim().optional(),
  message: z.string().trim().min(10, "Add a little more detail (10+ characters)"),
  consent: z.boolean().refine((v) => v, "Please accept the privacy note"),
});

type Errors = Partial<Record<keyof z.infer<typeof clientSchema>, string>>;

const interests = [
  "Machine learning & data",
  "Software & product builds",
  "Debate & communication",
  "Events & operations",
  "Design, media & outreach",
  "Not sure yet",
];

export function InquiryForm({ kind }: { kind: "join" | "contact" }) {
  const send = useServerFn(submitInquiry);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      department: String(form.get("department") ?? ""),
      year: String(form.get("year") ?? ""),
      interest: String(form.get("interest") ?? ""),
      message: String(form.get("message") ?? ""),
      consent: form.get("consent") === "on",
    };
    const parsed = clientSchema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = document.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setErrors({});
    setState("loading");
    setServerError(null);
    try {
      const result = await send({
        data: {
          kind,
          ...parsed.data,
          consent: true as const,
          website: String(form.get("website") ?? ""),
        },
      });
      setReference(result.reference);
      setState("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="surface-card space-y-3 p-8" role="status">
        <CheckCircle2 className="size-8 text-success" aria-hidden="true" />
        <h3 className="text-xl font-semibold">Submission received</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Your {kind === "join" ? "interest form" : "message"} was validated and recorded with reference{" "}
          <span className="font-mono text-foreground">{reference}</span>. The AIMSA team responds through the
          official channel published on the contact page.
        </p>
        <Button variant="quiet" onClick={() => setState("idle")}>
          Send another
        </Button>
      </div>
    );
  }

  const field = (key: keyof Errors) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  const ErrorText = ({ name }: { name: keyof Errors }) =>
    errors[name] ? (
      <p id={`${name}-error`} className="flex items-center gap-1.5 text-sm text-destructive">
        <AlertCircle className="size-3.5" aria-hidden="true" />
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="surface-card space-y-5 p-6 sm:p-8">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" autoComplete="name" required {...field("name")} />
          <ErrorText name="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required {...field("email")} />
          <ErrorText name="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">
            Branch / department <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="department" name="department" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">
            Year of study <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Input id="year" name="year" placeholder="e.g. Second year" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interest">Interest area</Label>
        <select
          id="interest"
          name="interest"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          defaultValue={interests[interests.length - 1]}
        >
          {interests.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">
          {kind === "join" ? "Why do you want to join AIMSA?" : "Your message"}
        </Label>
        <Textarea id="message" name="message" rows={5} required {...field("message")} />
        <ErrorText name="message" />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox id="consent" name="consent" className="mt-1" aria-describedby="consent-error" />
        <Label htmlFor="consent" className="text-sm font-normal leading-relaxed text-muted-foreground">
          I agree that AIMSA may store these details to respond to this enquiry. Details are not shared
          outside the association.
        </Label>
      </div>
      <ErrorText name="consent" />

      {serverError ? (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" aria-hidden="true" />
          {serverError}
        </p>
      ) : null}

      <Button type="submit" variant="hero" size="lg" disabled={state === "loading"}>
        {state === "loading" ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {state === "loading" ? "Submitting…" : kind === "join" ? "Submit interest form" : "Send message"}
      </Button>
    </form>
  );
}
