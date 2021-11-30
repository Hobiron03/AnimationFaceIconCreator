import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "./Card";
import AppContext from "../contexts/AppContext";
import firebase from "../../../Firebase";
import Typography from "@material-ui/core/Typography";

interface FreeReivewData {
  movieTitle: string;
  mTime: number;
  name: string;
  review: string;
  title: string;
  value: number;
}

const SelectMovieNormal = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState<FreeReivewData>({
    movieTitle: "",
    mTime: 0,
    name: "",
    review: "",
    title: "",
    value: 0,
  });

  let startTime = 0;
  let endTime = 0;

  useEffect(() => {
    GetReivews();
    startTime = performance.now();
  }, []);

  const GetReivews = async () => {
    const snapshot = await firebase.firestore().collection("FreeReview").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  return (
    <div>
      <div className={classes.content}>
        <div className={classes.left}>
          <Typography variant="h5" gutterBottom component="div">
            乗り遅れた旅人
          </Typography>
          <div className={classes.reviewList__under}>
            {reviews.map((review, index) => {
              return review.movieTitle === "yokohama" ? (
                <div className={classes.reviewList__border} key={index}>
                  <Card
                    value={review.value}
                    title={review.title}
                    review={review.review}
                  ></Card>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className={classes.right}>
          <Typography variant="h5" gutterBottom component="div">
            シェイクスピア・イン・トーキョー
          </Typography>
          <div className={classes.reviewList__under}>
            {reviews.map((review, index) => {
              return review.movieTitle === "shakespeare" ? (
                <div className={classes.reviewList__border} key={index}>
                  <Card
                    value={review.value}
                    title={review.title}
                    review={review.review}
                  ></Card>
                </div>
              ) : null;
            })}
          </div>
        </div>
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
}));

export default SelectMovieNormal;
