import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "./Card";
import firebase from "../../../Firebase";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import AppContext from "../contexts/AppContext";

import Button from "@material-ui/core/Button";
import FaceReviewCard from "./FaceReviewCard";

interface sendData {
  name: string;
  reviews: [];
  time: number;
}

interface reviewData {
  animationFaceIcon: string;
  coordinateImage: string;
  dataX: Array<number>;
  dataY: Array<number>;
  mTime: number;
  movieTitle: string;
  name: string;
  reviews: Array<string>;
  staticFaceIcon: Array<string>;
  title: string;
  writeMtime: number;
}

const SelectMoviePropose = () => {
  const classes = useStyles();
  const { state } = useContext(AppContext);
  const [name, setName] = useState("");
  const [searchRate, setSearchRate] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    GetReivews();
    setStartTime(performance.now());
  }, []);

  const GetReivews = async () => {
    const snapshot = await firebase
      .firestore()
      .collection("NewFaceIconReviewData")
      .get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  const onReviewViewEndButton = async () => {
    // const sendData: sendData = {
    //   name,
    //   reviews: state.helpfulReview,
    //   time: performance.now() - startTime,
    // };
    // const reviewsCollectionReference = firebase
    //   .firestore()
    //   .collection("readReviewNormal");
    // await reviewsCollectionReference.add(sendData);
    // console.log(name);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <div className={classes.inputName}>
        <h4>氏名</h4>
        <input
          className={classes.inputName__form}
          type="text"
          onChange={(e) => handleChangeName(e)}
        />
      </div>

      <div className={classes.searchRate}>
        <h3>顔アイコン検索</h3>

        {/* <Rating
          size="large"
          name="simple-controlled"
          value={searchRate}
          onChange={(event, newValue) => {
            setSearchRate(newValue);
          }}
        /> */}
      </div>

      <div className={classes.content}>
        <div className={classes.left}>
          <Typography variant="h5" gutterBottom component="div">
            乗り遅れた旅人
          </Typography>
          <div className={classes.reviewList__under}>
            {reviews.map((review, index) => {
              if (review.movieTitle === "yokohama") {
                return (
                  <div className={classes.reviewList__border} key={index}>
                    <FaceReviewCard
                      animationFaceIcon={review.animationFaceIcon}
                      title={review.title}
                      reviews={review.reviews}
                      staticFaceIcons={review.staticFaceIcon}
                    ></FaceReviewCard>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className={classes.right}>
          <Typography variant="h5" gutterBottom component="div">
            シェイクスピア・イン・トーキョー
          </Typography>
          <div className={classes.reviewList__under}>
            {reviews.map((review, index) => {
              if (review.movieTitle === "shakespeare") {
                return (
                  <div className={classes.reviewList__border} key={index}>
                    <FaceReviewCard
                      animationFaceIcon={review.animationFaceIcon}
                      title={review.title}
                      reviews={review.reviews}
                      staticFaceIcons={review.staticFaceIcon}
                    ></FaceReviewCard>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
      <div className={classes.okButton}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onReviewViewEndButton}
        >
          <Typography variant="h6" gutterBottom>
            レビューを読み終える
          </Typography>
        </Button>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  reviewList: {
    width: "30%",
    display: "flex",
    flexWrap: "wrap",
  },
  reviewList__border: {
    margin: "10px 10px 10px 10px",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    margin: "50px auto",
    textAlign: "center",
  },
  left: {
    margin: "10px 10px 10px 10px",
    width: "40%",
  },
  reviewList__under: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  right: {
    margin: "10px 10px 10px 10px",
    width: "40%",
  },
  okButton: {
    textAlign: "center",
    margin: "0 auto",
  },
  inputName: {
    textAlign: "center",
    margin: "0 auto",
    height: 100,
  },
  inputName__form: {
    height: 30,
    width: 200,
  },
  searchRate: {
    textAlign: "center",
    margin: "0 auto",
    height: 50,
  },
}));

export default SelectMoviePropose;
