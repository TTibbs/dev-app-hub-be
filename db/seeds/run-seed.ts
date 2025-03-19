import * as devData from "../data/dev-data";
import seed from "./seed";
import db from "../connection";

const runSeed = () => {
  return seed({
    users: devData.userData,
    apps: devData.appsData,
    ratings: devData.ratingsData,
    comments: devData.commentsData,
    issues: devData.issuesData,
    categories: devData.categoriesData,
  }).then(() => {
    console.log("Development database seeded successfully");
    return db.end();
  });
};

runSeed();
