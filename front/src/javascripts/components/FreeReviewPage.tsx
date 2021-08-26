import * as React from "React";
import { useState, useEffect } from "react";
import firebase from "../../../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

type SendFirebaseType = {
  value: number;
  title: string;
  review: string;
  mTime: number;
};

const FreeReviewModal = () => {
  const classes = useStyles();
  const [title, setTitle] = useState("");

  const [value, setValue] = useState<number | null>(2);

  const [review, setReview] = useState("");

  const [isTitleScreen, setIsTitleScreen] = useState(true);

  let startTime = 0;
  let endTime = 0;

  useEffect(() => {
    startTime = performance.now();
  }, []);

  const toggleModalScreen = () => {
    setIsTitleScreen(!isTitleScreen);
  };

  const handleFinishReviewButton = async () => {
    endTime = performance.now();
    console.log(endTime - startTime);

    //ここでfirebaseに送信
    const sendData: SendFirebaseType = {
      value,
      title,
      review,
      mTime: endTime - startTime,
    };

    // firebaseにレビューデータを送信;
    const reviewsCollectionReference = firebase
      .firestore()
      .collection("FreeReview");

    await reviewsCollectionReference.add(sendData);

    setValue(2);
    setTitle("");
    setReview("");
    toggleModalScreen();
  };

  const handleReviewContentOnChange = (e) => {
    setReview(e.target.value);
  };

  const handleReviewTitleOnChange = (e) => {
    setTitle(e.target.value);
  };

  const ModalBodyReview = (
    <div className={classes.paper}>
      <div className={classes.reviewArea}>
        <h3>レビューを記述</h3>
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
        <Button variant="outlined" color="primary" onClick={toggleModalScreen}>
          戻る
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleFinishReviewButton()}
        >
          終了
        </Button>
      </div>
    </div>
  );

  const ModalBodyTitle = (
    <div className={classes.paper}>
      <div className={classes.reviewArea}>
        <div>
          <h3>総合評価</h3>
          <Rating
            size="large"
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
        <div>
          <h3>タイトル入力</h3>
          <textarea
            className={classes.reviewAreaContentTitle}
            onChange={(e) => handleReviewTitleOnChange(e)}
            placeholder="レビューのタイトルを入力してください"
            cols={4}
            rows={2}
            value={title}
          ></textarea>
        </div>
      </div>

      <div className={classes.buttons}>
        <Button variant="outlined" color="primary" onClick={toggleModalScreen}>
          続ける
        </Button>
      </div>
    </div>
  );

  return <div>{isTitleScreen ? ModalBodyTitle : ModalBodyReview}</div>;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 800,
    margin: "30px auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
  },
  reviewModalFaceIcons: {
    display: "flex",
    justifyContent: "center",
  },
  reviewArea: {
    margin: "0 auto",
  },
  reviewAreaContentTitle: {
    width: 500,
    height: 50,
    maxWidth: 640,
    maxHeight: 260,
    fontSize: 15,
  },
  reviewAreaContent: {
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
  thank: {
    margin: 100,
    textAlign: "center",
    fontSize: 25,
    background: "red",
  },
}));

export default FreeReviewModal;
