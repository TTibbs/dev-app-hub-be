import { User } from "../../types";

export const users: User[] = [
  {
    username: "alice123",
    name: "Alice",
    email: "alice@example.com",
    role: "developer",
    password: "password",
    avg_rating: 4.5,
    created_at: new Date("2024-12-10T08:30:00Z"),
    updated_at: new Date("2024-12-10T08:30:00Z"),
  },
  {
    username: "bob123",
    name: "Bob",
    email: "bob@example.com",
    role: "user",
    password: "password",
    avg_rating: null,
    created_at: new Date("2024-12-15T10:45:00Z"),
    updated_at: new Date("2024-12-15T10:45:00Z"),
  },
  {
    username: "charlie123",
    name: "Charlie",
    email: "charlie@example.com",
    role: "developer",
    password: "password",
    avg_rating: 4.0,
    created_at: new Date("2024-12-20T14:20:00Z"),
    updated_at: new Date("2024-12-20T14:20:00Z"),
  },
];
