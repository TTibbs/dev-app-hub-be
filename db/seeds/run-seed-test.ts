import * as testData from "../data/test-data";
import seed from "./seed";
import db from "../connection";

const runSeed = () => {
  return seed({
    users: testData.userData,
    apps: testData.appsData,
    ratings: testData.ratingsData,
    comments: testData.commentsData,
    issues: testData.issuesData,
    categories: testData.categoriesData,
  }).then(() => {
    console.log("Test database seeded successfully");
    return db.end();
  });
};

runSeed();
