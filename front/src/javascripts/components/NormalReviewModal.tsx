import * as React from "React";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";

const NormalReivewModal = ({
  isReviewContentModalOpen,
  toggleModalState,
  value,
  title,
  content,
}) => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({
    dynamicFaceIcon: "",
    title: "",
    canvasImage: "",
    EmotionalFaceIcon: [],
    comments: [],
  });

  const CloseReviewModal = () => {
    toggleModalState();
  };

  return (
    <Modal
      open={true}
      onClose={CloseReviewModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.paper}>
        <Rating size="large" name="simple-controlled" value={value} readOnly />
        <h3>{title}</h3>
        <Typography variant="body1" gutterBottom>
          {content}
        </Typography>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    margin: "70px auto",
    borderRadius: 10,
    backgroundColor: theme.palette.background.paper,
    padding: "30px 25px 15px 25px",
  },
}));

export default NormalReivewModal;
