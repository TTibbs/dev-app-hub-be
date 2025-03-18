import { getData } from "../data";
import seed from "./seed";
import db from "../connection";

const runSeed = () => {
  return seed(getData()).then(() => db.end());
};

runSeed();
