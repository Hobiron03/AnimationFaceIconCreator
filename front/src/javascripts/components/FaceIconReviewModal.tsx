import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import Button from "@material-ui/core/Button";
import AppContext from "../contexts/AppContext";

import { ListItem } from "@material-ui/core";
import { List } from "@material-ui/core";
import { ADD_HELPFUL_REVIEW_PROPOSE } from "../actions";

const FaceIconReivewModal = ({
  toggleModalState,
  animationFaceIcon,
  staticFaceIcons,
  title,
  reviews,
  isHelpful,
  setIsHelpful,
  isSelectHelpfulReviewMode,
}) => {
  const classes = useStyles();
  const { state, dispatch } = useContext(AppContext);
  // const [isHelpful, setIsHelpful] = useState(false);

  useEffect(() => {
    // state.helpfulReview.forEach((review) => {
    //   if (isHelpful) {
    //     setIsHelpful(true);
    //   }
    // });
    console.log(staticFaceIcons);
  }, []);

  const CloseReviewModal = () => {
    toggleModalState();
  };

  const onHelpfulButtonClick = () => {
    console.log(reviews);
    dispatch({
      type: ADD_HELPFUL_REVIEW_PROPOSE,
      reviews: {
        title,
        reviews,
      },
    });

    setIsHelpful(true);
  };

  const returnHelpfulButtonTSX = () => {
    if (isSelectHelpfulReviewMode) {
      return (
        <div className={classes.paper__helpfulButton}>
          {!isHelpful ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={onHelpfulButtonClick}
            >
              役に立った
            </Button>
          ) : (
            <Button variant="contained" color="primary" disabled={true}>
              Thank you
            </Button>
          )}
        </div>
      );
    }
  };

  return (
    <Modal
      open={true}
      onClose={CloseReviewModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{ overflow: "scroll" }}
    >
      <div className={classes.paper}>
        <div className={classes.paper__title}>
          <img src={animationFaceIcon} alt="" width="80" />
          <h3>{title}</h3>
        </div>

        <List style={{ maxHeight: "200", overflow: "auto" }}>
          {reviews.map((review, index) => {
            return (
              <ListItem alignItems="flex-start">
                <div className={classes.paper__review}>
                  <img
                    src={staticFaceIcons[index]}
                    alt=""
                    width="80"
                    className={classes.paper__review__img}
                  />
                  <p>{review}</p>
                </div>
              </ListItem>
            );
          })}
        </List>

        {returnHelpfulButtonTSX()}
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
  paper__title: {
    textAlign: "center",
  },
  paper__review: {
    display: "flex",
  },
  paper__review__img: {
    marginRight: 20,
  },
  paper__helpfulButton: {
    marginTop: 25,
  },
}));

export default FaceIconReivewModal;
