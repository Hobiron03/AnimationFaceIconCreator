import { combineReducers } from "redux";
import filterEmotion from "./filterByEmotion";
import filterFaceIcon from "./filterByFaceIcon";
import filterDTW from "./filterByDTW";
import helpfulReview from "./helpfulReview";
import readReviewPropose from "./readReviewPropose";
import helpfulReviewPropose from "./helpfulReviewPropose";

export default combineReducers({
  filterEmotion,
  filterFaceIcon,
  filterDTW,
  helpfulReview,
  readReviewPropose,
  helpfulReviewPropose,
});
