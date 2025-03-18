import { Issue } from "../types";

export const issues: Issue[] = [
  {
    title: "Login button not working",
    description:
      "When I click the login button nothing happens. Using Chrome on Windows.",
    status: "open",
    author_id: 2, // Bob
    app_id: 1, // App 1
    created_at: new Date("2025-01-25T08:15:00Z"),
    updated_at: new Date("2025-01-25T08:15:00Z"),
  },
  {
    title: "Dark mode not saving preferences",
    description:
      "Every time I restart the app, it switches back to light mode. Please fix!",
    status: "in progress",
    author_id: 2, // Bob
    app_id: 2, // App 2
    created_at: new Date("2025-01-27T14:30:00Z"),
    updated_at: new Date("2025-02-01T09:45:00Z"),
  },
  {
    title: "Images not loading on slow connections",
    description: "When on a slow network, images fail to load and never retry.",
    status: "closed",
    author_id: 3, // Charlie
    app_id: 1, // App 1
    created_at: new Date("2025-01-28T11:20:00Z"),
    updated_at: new Date("2025-02-05T16:40:00Z"),
  },
  {
    title: "Feature request: Export data option",
    description: "It would be great to have an option to export data as CSV.",
    status: "open",
    author_id: 2, // Bob
    app_id: 1, // App 1
    created_at: new Date("2025-02-03T10:05:00Z"),
    updated_at: new Date("2025-02-03T10:05:00Z"),
  },
];
