import { App } from "../../types";

export const apps: App[] = [
  {
    name: "Prompt Wallet",
    description: "A wallet for your prompts",
    category: "AI Tools",
    app_url: "https://promptwallet.com",
    app_img_url: "https://picsum.photos/200/300",
    avg_rating: 4.5,
    developer_id: 1, // Alice is the developer
    created_at: new Date("2025-01-05T09:00:00Z"),
    updated_at: new Date("2025-01-05T09:00:00Z"),
  },
  {
    name: "No Code Email Templates",
    description: "Drag and drop email templates",
    category: "Email Marketing",
    app_url: "https://nocodeemailtemplates.com",
    app_img_url: "https://picsum.photos/200/300",
    avg_rating: 4.0,
    developer_id: 3, // Charlie is the developer
    created_at: new Date("2025-01-10T11:30:00Z"),
    updated_at: new Date("2025-01-10T11:30:00Z"),
  },
];
