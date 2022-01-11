import * as React from "React";
import { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import FaceIconReviewModal from "./FaceIconReviewModal";
import AppContext from "../contexts/AppContext";
import {
  ADD_READ_REVIEW_PROPOSE,
  UPDATE_READ_REVIEW_PROPOSE,
} from "../actions/";

interface CardProps {
  animationFaceIcon: string;
  title: string;
  reviews: Array<string>;
  staticFaceIcons: Array<string>;
  isSelectHelpfulReviewMode: Boolean;
}

const FaceReviewCard = (props: CardProps) => {
  const classes = useStyles();

  const { state, dispatch } = useContext(AppContext);
  const [isReviewContentModalOpen, setIsReviewContentModalOpen] =
    useState(false);
  const [startTime, setStartTime] = useState(0);
  const [viewTime, setViewTime] = useState(0);
  const [isHelpful, setIsHelpful] = useState(false);

  const reviewContentModal = () => {
    return isReviewContentModalOpen ? (
      <FaceIconReviewModal
        isSelectHelpfulReviewMode={props.isSelectHelpfulReviewMode}
        toggleModalState={toggleModalState}
        animationFaceIcon={props.animationFaceIcon}
        staticFaceIcons={props.staticFaceIcons}
        title={props.title}
        reviews={props.reviews}
        isHelpful={isHelpful}
        setIsHelpful={setIsHelpful}
      ></FaceIconReviewModal>
    ) : null;
  };

  const toggleModalState = () => {
    setIsReviewContentModalOpen(false);

    if (viewTime === 0) {
      dispatch({
        type: ADD_READ_REVIEW_PROPOSE,
        review: {
          title: props.title,
          reviews: props.reviews,
          isHelpful,
          readTime: viewTime + performance.now() - startTime,
        },
      });
      console.log("ADD REVIEW");
      console.log(isHelpful);
    } else {
      dispatch({
        type: UPDATE_READ_REVIEW_PROPOSE,
        review: {
          title: props.title,
          reviews: props.reviews,
          isHelpful,
          readTime: viewTime + performance.now() - startTime,
        },
      });
    }

    setViewTime(viewTime + performance.now() - startTime);
  };

  const displayReviewOnClick = () => {
    setIsReviewContentModalOpen(true);
    setStartTime(performance.now());
  };

  const onHelpfulButtonClick = () => {
    // setIsHelpful(true);
    console.log("onHelpfulButtonClick");
  };

  return (
    <div>
      {reviewContentModal()}
      <div onClick={displayReviewOnClick}>
        <div>
          <Paper elevation={5} square className={classes.card}>
            <div>
              <img src={props.animationFaceIcon} alt="" width="100" />
            </div>
            <div>
              <h3>{props.title}</h3>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  card: {
    cursor: "pointer",
    borderRadius: 10,
    padding: "15px 20px 15px 20px",
    width: 330,
    transition: "all 0.2s",
    "&:hover": {
      transform: "scale(1.05,1.05)",
    },
  },
}));

export default FaceReviewCard;
