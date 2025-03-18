import { Comment } from "../../types";

export const comments: Comment[] = [
  {
    body: "This app is great!",
    votes: 10,
    author_id: 1, // Alice
    app_id: 1, // Comment on App 1
    rating_id: null,
    issue_id: null,
    created_at: new Date("2025-01-12T09:30:00Z"),
    updated_at: new Date("2025-01-12T09:30:00Z"),
  },
  {
    body: "I'm not sure I agree with this.",
    votes: 4,
    author_id: 2, // Bob
    app_id: 1, // Comment on App 1
    rating_id: null,
    issue_id: null,
    created_at: new Date("2025-01-13T14:25:00Z"),
    updated_at: new Date("2025-01-13T14:25:00Z"),
  },
  {
    body: "I had the same experience with this app.",
    votes: 2,
    author_id: 3, // Charlie
    app_id: null,
    rating_id: 2, // Comment on Rating 2
    issue_id: null,
    created_at: new Date("2025-01-19T11:15:00Z"),
    updated_at: new Date("2025-01-19T11:15:00Z"),
  },
  {
    body: "Totally agree with your assessment!",
    votes: 1,
    author_id: 3, // Charlie
    app_id: null,
    rating_id: 1, // Comment on Rating 1
    issue_id: null,
    created_at: new Date("2025-01-16T16:40:00Z"),
    updated_at: new Date("2025-01-16T16:40:00Z"),
  },
  {
    body: "I've been experiencing this issue as well. Very annoying!",
    votes: 3,
    author_id: 2, // Bob
    app_id: null,
    rating_id: null,
    issue_id: 4, // Comment on Issue 4
    created_at: new Date("2025-02-04T10:30:00Z"),
    updated_at: new Date("2025-02-04T10:30:00Z"),
  },
  {
    body: "Would love to see this implemented. It would save me so much time.",
    votes: 5,
    author_id: 1, // Alice
    app_id: null,
    rating_id: null,
    issue_id: 4, // Comment on Issue 4
    created_at: new Date("2025-02-05T13:20:00Z"),
    updated_at: new Date("2025-02-05T13:20:00Z"),
  },
];
