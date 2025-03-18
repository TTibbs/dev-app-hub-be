import * as devData from "./dev-data";
import * as testData from "./test-data";
import { User, App, Rating, Comment, Issue } from "../types";

export interface DataSet {
  userData: User[];
  appsData: App[];
  ratingsData: Rating[];
  commentsData: Comment[];
  issuesData: Issue[];
}

// Get data based on the environment
export const getData = (): DataSet => {
  const env = process.env.NODE_ENV || "development";

  if (env === "test") {
    return testData as unknown as DataSet;
  } else {
    return devData as unknown as DataSet;
  }
};

// Export types for ease of use
export * from "../types";
