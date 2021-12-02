import { ADD_HELPFUL_REVIEW } from "../actions/index";

interface helpfulReview {
  title: string;
  value: number;
  content: string;
}

interface helpfulReviewAction {
  type: string;
  review: helpfulReview;
}

const helpfulReview = (state = [], action) => {
  switch (action.type) {
    case ADD_HELPFUL_REVIEW:
      return [...state, action.review];
    default:
      return state;
  }
};

export default helpfulReview;
