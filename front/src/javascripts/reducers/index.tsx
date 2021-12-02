import { combineReducers } from "redux";
import filterEmotion from "./filterByEmotion";
import filterFaceIcon from "./filterByFaceIcon";
import filterDTW from "./filterByDTW";
import helpfulReview from "./helpfulReview";

export default combineReducers({
  filterEmotion,
  filterFaceIcon,
  filterDTW,
  helpfulReview,
});
