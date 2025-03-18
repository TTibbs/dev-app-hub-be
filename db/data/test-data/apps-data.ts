import { App } from "../../types";

export const apps: App[] = [
  {
    name: "App 1",
    description: "App 1 description",
    app_url: "https://app1.com",
    app_img_url: "https://picsum.photos/200/300",
    avg_rating: 4.5,
    developer_id: 1, // Alice is the developer
    created_at: new Date("2025-01-05T09:00:00Z"),
    updated_at: new Date("2025-01-05T09:00:00Z"),
  },
  {
    name: "App 2",
    description: "App 2 description",
    app_url: "https://app2.com",
    app_img_url: "https://picsum.photos/200/300",
    avg_rating: 4.0,
    developer_id: 3, // Charlie is the developer
    created_at: new Date("2025-01-10T11:30:00Z"),
    updated_at: new Date("2025-01-10T11:30:00Z"),
  },
];
