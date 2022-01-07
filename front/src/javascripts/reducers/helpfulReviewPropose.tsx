import {
  ADD_HELPFUL_REVIEW_PROPOSE,
  UPDATE_HELPFUL_REVIEW_PROPOSE,
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
  review: helpfulReview;
}

const helpfulReviewPropose = (state = [], action) => {
  switch (action.type) {
    case ADD_HELPFUL_REVIEW_PROPOSE:
      return [...state, action.review];
    case UPDATE_HELPFUL_REVIEW_PROPOSE:
      const updateState = state.map((review) => {
        if (action.review.title === review.title) {
          return action.review;
        }
        return review;
      });
      return updateState;
    default:
      return state;
  }
};

export default helpfulReviewPropose;
