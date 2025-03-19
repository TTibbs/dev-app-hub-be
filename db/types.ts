export type App = {
  name: string;
  description: string;
  category: string;
  app_url: string;
  app_img_url: string;
  avg_rating: number;
  developer_id: number;
  created_at: Date;
  updated_at: Date;
};

export type Comment = {
  body: string;
  votes: number;
  author_id: number;
  app_id?: number | null;
  rating_id?: number | null;
  issue_id?: number | null;
  created_at: Date;
  updated_at: Date;
};

export type Category = {
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
};

export type Issue = {
  title: string;
  description: string;
  status: "open" | "in progress" | "closed";
  author_id: number;
  app_id: number;
  created_at: Date;
  updated_at: Date;
};

export type Rating = {
  rating: number;
  body: string;
  author_id: number;
  app_id?: number | null;
  developer_id?: number | null;
  created_at: Date;
  updated_at: Date;
};

export type User = {
  username: string;
  name: string;
  email: string;
  role: "developer" | "user";
  avg_rating?: number | null;
  created_at: Date;
  updated_at: Date;
  app_ids?: number[] | null;
  password: string;
};

export type PoolConfig = {
  connectionString?: string;
  max?: number;
  ssl?: {
    rejectUnauthorized: boolean;
  };
};
