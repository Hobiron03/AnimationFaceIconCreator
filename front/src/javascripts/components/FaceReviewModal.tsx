import * as React from "React";
import { useState, useEffect } from "react";
import firebase from "../../../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

type FaceReviewModalType = {
  isFaceIconReviewModalOpen: boolean;
  setIsFaceIconModalOpen: () => void;
  base64Iimages: [];
};

const FaceReviewModal = ({
  isFaceIconReviewModalOpen,
  setIsFaceIconModalOpen,
  base64Images,
}) => {
  const classes = useStyles();
  const [faceIcons, setFaceIcons] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [review, setReview] = useState("");
  const [reviewFaceIcon, setReviewFaceIcon] = useState(base64Images[0]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [reduceFaceIcons, setReduceFaceIcon] = useState([]);
  const [reduceNum, _] = useState(13);

  useEffect(() => {
    //数を削減
    if (base64Images.length > reduceNum) {
      const degree = base64Images.length / (reduceNum - 1);

      // setReduceFaceIcon([...reduceFaceIcons, base64Images[0]]);
      const rfaces = [];
      rfaces.push(base64Images[0]);
      for (let index = degree; index < base64Images.length; index += degree) {
        rfaces.push(base64Images[Math.floor(index)]);
      }
      rfaces.push(base64Images[base64Images.length - 1]);

      setReduceFaceIcon(rfaces);
    } else {
      setReduceFaceIcon(base64Images);
    }

    setReviewFaceIcon(base64Images[0]);

    let initArr = new Array(base64Images.length);
    initArr.fill("");
    setReviews(initArr);
  }, [isFaceIconReviewModalOpen]);

  const CloseReviewModal = () => {
    console.log(reduceFaceIcons);
    setIsFaceIconModalOpen(false);
  };

  const handleReviewFaceIconClick = (base64Image, index) => {
    const newFaceIcons = faceIcons;
    newFaceIcons[selectedIndex] = reviewFaceIcon;
    setReviewFaceIcon(newFaceIcons);

    const newReview = reviews;
    newReview[selectedIndex] = review;
    setReviews(newReview);

    setSelectedIndex(index);
    setReviewFaceIcon(base64Image);

    setReview(reviews[index]);
    console.log(reviews);
  };

  const handleContinueReviewButton = () => {
    const newFaceIcons = faceIcons;
    newFaceIcons[selectedIndex] = reviewFaceIcon;
    setReviewFaceIcon(newFaceIcons);

    const newReview = reviews;
    newReview[selectedIndex] = review;
    setReviews(newReview);

    setReview("");
    setSelectedIndex(selectedIndex + 1);
  };

  const handleFinishReviewButton = () => {
    console.log(faceIcons);
    console.log(reviews);
  };

  const handleReviewContentOnChange = (e) => {
    setReview(e.target.value);
  };

  const ModalBody = (
    <div className={classes.paper}>
      <h2>レビューの執筆</h2>

      <div className={classes.reviewModalFaceIcons}>
        {reduceFaceIcons.map((reduceFaceIcon, index) => {
          return (
            <div
              className={
                selectedIndex === index
                  ? classes.reviewModalFaceIconSelected
                  : classes.reviewModalFaceIcon
              }
              onClick={() => handleReviewFaceIconClick(reduceFaceIcon, index)}
            >
              <img src={reduceFaceIcon} key={index} width={50} height={50} />
            </div>
          );
        })}
      </div>

      <div className={classes.reviewFaceIconMain}>
        <img
          src={base64Images[selectedIndex]}
          alt=""
          width={150}
          height={150}
        />
      </div>

      <div className={classes.reviewArea}>
        <textarea
          className={classes.reviewAreaContent}
          onChange={(e) => handleReviewContentOnChange(e)}
          value={review}
          placeholder="感想など感じたことを書いてください"
          cols={6}
          rows={4}
        ></textarea>
      </div>

      <div className={classes.buttons}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleFinishReviewButton}
        >
          終了
        </Button>

        <Button
          variant="outlined"
          color="primary"
          onClick={handleContinueReviewButton}
        >
          続ける
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      open={isFaceIconReviewModalOpen}
      onClose={CloseReviewModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {ModalBody}
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    margin: "30px auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  reviewModalFaceIcons: {
    display: "flex",
    justifyContent: "center",
  },
  reviewModalFaceIcon: {
    cursor: "pointer",
    margin: 3,
    "&:hover": {
      transition: "all 0.2s",
      backgroundColor: "rgba(0, 0, 255, 0.1)",
    },
  },
  reviewModalFaceIconSelected: {
    cursor: "pointer",
    margin: 3,
    backgroundColor: "rgba(0, 0, 255, 0.3)",
  },
  reviewFaceIconMain: {
    display: "flex",
    justifyContent: "center",
    margin: 10,
  },
  reviewArea: {
    display: "flex",
    justifyContent: "center",
  },
  reviewAreaContent: {
    marginTop: 20,
    width: 500,
    height: 200,
    maxWidth: 640,
    maxHeight: 260,
    fontSize: 15,
  },
  buttons: {
    display: "flex",
    justifyContent: "space-around",
    margin: 10,
  },
}));

export default FaceReviewModal;
