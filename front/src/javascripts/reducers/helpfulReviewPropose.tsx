import {
  ADD_HELPFUL_REVIEW_PROPOSE,
  UPDATE_HELPFUL_REVIEW_PROPSE,
} from "../actions/index";

interface helpfulReview {
  title: string;
  value: number;
  reviews: Array<string>;
  isHelpful: boolean;
  readTime: number;
}

interface helpfulReviewAction {
  type: string;
  reviews: helpfulReview;
}

const helpfulReviewPropose = (state = [], action) => {
  switch (action.type) {
    case ADD_HELPFUL_REVIEW_PROPOSE:
      return [...state, action.reviews];
    default:
      return state;
  }
};

export default helpfulReviewPropose;
