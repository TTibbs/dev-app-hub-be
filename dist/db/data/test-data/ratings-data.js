"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratings = void 0;
exports.ratings = [
    {
        rating: 5,
        body: "This app is amazing! Love the interface.",
        author_id: 2, // Bob
        app_id: 1, // App 1
        developer_id: null,
        created_at: new Date("2025-01-15T13:45:00Z"),
        updated_at: new Date("2025-01-15T13:45:00Z"),
    },
    {
        rating: 4,
        body: "Good app but could use some improvements.",
        author_id: 3, // Charlie
        app_id: 1, // App 1
        developer_id: null,
        created_at: new Date("2025-01-17T10:20:00Z"),
        updated_at: new Date("2025-01-17T10:20:00Z"),
    },
    {
        rating: 4,
        body: "Solid functionality, but the UI needs work.",
        author_id: 2, // Bob
        app_id: 2, // App 2
        developer_id: null,
        created_at: new Date("2025-01-20T15:10:00Z"),
        updated_at: new Date("2025-01-20T15:10:00Z"),
    },
    // Developer ratings
    {
        rating: 5,
        body: "Great developer! Very responsive to feedback.",
        author_id: 2, // Bob
        app_id: null,
        developer_id: 1, // Alice
        created_at: new Date("2025-01-22T09:15:00Z"),
        updated_at: new Date("2025-01-22T09:15:00Z"),
    },
    {
        rating: 4,
        body: "Consistently delivers quality apps. Good communication.",
        author_id: 2, // Bob
        app_id: null,
        developer_id: 3, // Charlie
        created_at: new Date("2025-01-24T14:30:00Z"),
        updated_at: new Date("2025-01-24T14:30:00Z"),
    },
    {
        rating: 5,
        body: "Excellent work on bug fixes. Very professional.",
        author_id: 1, // Alice
        app_id: null,
        developer_id: 3, // Charlie
        created_at: new Date("2025-01-26T11:45:00Z"),
        updated_at: new Date("2025-01-26T11:45:00Z"),
    },
];
