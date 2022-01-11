import {
  ADD_READ_REVIEW_PROPOSE,
  UPDATE_READ_REVIEW_PROPOSE,
  DELETE_ALL_READ_REVIEW_PROPOSE,
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

const readReviewPropose = (state = [], action) => {
  switch (action.type) {
    case ADD_READ_REVIEW_PROPOSE:
      return [...state, action.review];
    case UPDATE_READ_REVIEW_PROPOSE:
      const updateState = state.map((review) => {
        if (action.review.title === review.title) {
          return action.review;
        }
        return review;
      });
      return updateState;
    case DELETE_ALL_READ_REVIEW_PROPOSE:
      return [];
    default:
      return state;
  }
};

export default readReviewPropose;
