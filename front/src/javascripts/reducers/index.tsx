import { combineReducers } from "redux";
import filterEmotion from "./filterByEmotion";
import filterFaceIcon from "./filterByFaceIcon";
import filterDTW from "./filterByDTW";
import helpfulReview from "./helpfulReview";
import helpfulReviewPropose from "./helpfulReviewPropose";

export default combineReducers({
  filterEmotion,
  filterFaceIcon,
  filterDTW,
  helpfulReview,
  helpfulReviewPropose,
});
