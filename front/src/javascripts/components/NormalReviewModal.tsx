import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AppContext from "../contexts/AppContext";
import { ADD_HELPFUL_REVIEW } from "../actions/";

const NormalReivewModal = ({ toggleModalState, value, title, content }) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(AppContext);
  const [isHelpful, setIsHelpful] = useState(false);

  useEffect(() => {
    state.helpfulReview.forEach((review) => {
      if (review.title === title) {
        setIsHelpful(true);
      }
    });
  }, []);

  const CloseReviewModal = () => {
    toggleModalState();
  };

  const onHelpfullButtonClick = () => {
    dispatch({
      type: ADD_HELPFUL_REVIEW,
      review: {
        title,
        value,
        content,
      },
    });
    console.log("Dispatch Helpful Review");
    console.log(state.helpfulReview);

    setIsHelpful(true);
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
        <div className={classes.paper__helpfulButton}>
          {!isHelpful ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={onHelpfullButtonClick}
            >
              役に立った
            </Button>
          ) : (
            <Button variant="contained" color="primary" disabled={true}>
              Thank you
            </Button>
          )}
        </div>
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
  paper__helpfulButton: {
    marginTop: 25,
  },
}));

export default NormalReivewModal;
