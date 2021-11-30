import * as React from "React";
import { useState, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
// import DescModal from "../DescModal/DescModal";
import NormalReviewModal from "./NormalReviewModal";

interface CardProps {
  value: number;
  title: string;
  review: string;
}

const Card = (props: CardProps) => {
  const classes = useStyles();
  const [isReviewContentModalOpen, setIsReviewContentModalOpen] =
    useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [viewTime, setViewTime] = useState(0);

  const reviewContentModal = () => {
    return isReviewContentModalOpen ? (
      <NormalReviewModal
        isReviewContentModalOpen={isReviewContentModalOpen}
        toggleModalState={toggleModalState}
        value={props.value}
        title={props.title}
        content={props.review}
      ></NormalReviewModal>
    ) : null;
  };

  const toggleModalState = () => {
    setIsReviewContentModalOpen(false);
    setViewTime(viewTime + performance.now() - startTime);
  };

  const displayReviewOnClick = () => {
    setIsReviewContentModalOpen(true);
    setStartTime(performance.now());
  };

  return (
    <div>
      {reviewContentModal()}
      <div onClick={displayReviewOnClick}>
        <div>
          <Paper elevation={5} square className={classes.card}>
            <div>
              <Rating
                size="large"
                name="simple-controlled"
                value={props.value}
                readOnly
              />
            </div>
            <div>
              <p>{props.title}</p>
              <p>{startTime}</p>

              <p>{viewTime}</p>
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

export default Card;
