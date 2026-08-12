import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { inquirySchema, rateLimit, reference, deliver } from "./inquiries.server";

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) {
      return { ok: true as const, reference: reference() };
    }
    const request = getRequest();
    const ip =
      request?.headers.get("cf-connecting-ip") ??
      request?.headers.get("x-forwarded-for") ??
      "anonymous";
    if (!rateLimit(ip)) {
      throw new Error("Too many submissions from this connection. Please try again later.");
    }
    const ref = reference();
    deliver(data, ref);
    return { ok: true as const, reference: ref };
  });
