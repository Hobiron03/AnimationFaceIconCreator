import { ADD_HELPFUL_REVIEW, UPDATE_HELPFUL_REVIEW } from "../actions/index";

interface helpfulReview {
  title: string;
  value: number;
  content: string;
  isHelpful: boolean;
  readTime: number;
}

interface helpfulReviewAction {
  type: string;
  review: helpfulReview;
}

const helpfulReview = (state = [], action) => {
  switch (action.type) {
    case ADD_HELPFUL_REVIEW:
      return [...state, action.review];
    case UPDATE_HELPFUL_REVIEW:
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

export default helpfulReview;
