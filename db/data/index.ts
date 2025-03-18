import * as devData from "./dev-data";
import * as testData from "./test-data";
import { User, App, Rating, Comment, Issue } from "../types";

export interface DataSet {
  users: User[];
  apps: App[];
  ratings: Rating[];
  comments: Comment[];
  issues: Issue[];
}

// Get data based on the environment
export const getData = (): DataSet => {
  const env = process.env.NODE_ENV || "test"; // Default to test environment if none specified

  console.log(`Seeding database with ${env} data`);

  if (env === "development" || env === "production") {
    return devData as DataSet;
  }

  // Default to test data
  return testData as DataSet;
};

// Export types for ease of use
export * from "../types";
