import { cmsProjects } from "@/lib/cms/store";
import type { Project } from "./types";

/**
 * Student build showcase. Add an entry only when the project is real and the
 * team has approved publication — never seed illustrative projects.
 *
 * Example shape:
 * {
 *   id: "campus-vision",
 *   title: "Campus Vision",
 *   summary: "Crowd-density estimation for LTCE canteen queues.",
 *   domain: "Computer Vision",
 *   stage: "In development",
 *   year: "2025",
 *   stack: ["PyTorch", "OpenCV", "FastAPI"],
 *   published: true,
 * }
 */
export const projects: Project[] = [];

export const projectDomains = [
  "Machine Learning",
  "Computer Vision",
  "NLP",
  "Data Science",
  "Generative AI",
  "Robotics",
  "Tooling",
] as const;

export const projectStages = ["Concept", "In development", "Shipped"] as const;

export function publishedProjects() {
  return cmsProjects().filter((p) => p.published);
}