import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";

import firebase from "../../../Firebase";

interface ReivewData {
  name: string;
  dynamicFaceIcon: string;
  title: string;
  movieTitle: string;
  canvasImage: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
  emotions: Array<string>;
}

const categories = [
  ["がんこちゃん", "がんこちゃん2"],
  ["空撮", "空撮2"],
  ["花のワルツ", "新世界より"],
];

const Analysis = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState<ReivewData>({
    name: "",
    dynamicFaceIcon: "",
    title: "",
    movieTitle: "",
    canvasImage: "",
    EmotionalFaceIcon: [],
    comments: [],
    emotions: [],
  });

  useEffect(() => {
    FetchReivews();
  }, []);

  const FetchReivews = async () => {
    const snapshot = await firebase.firestore().collection("reviews").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  const FetchReivewsB3 = async () => {
    const snapshot = await firebase.firestore().collection("reviewsB3").get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  const FilterReviewByMovieTitle = (movieTitle: string): Array<ReivewData> => {
    return reviews.filter((review) => review.movieTitle === movieTitle);
  };

  const FilterReviewByMovieTitles = (
    movieTitles: Array<string>
  ): Array<ReivewData> => {
    return reviews.filter((review) => movieTitles.includes(review.movieTitle));
  };

  const FilterReviewByCategory = (category) => {
    return (
      <div className={classes.separateByCategoryReview}>
        {FilterReviewByMovieTitles(category).map(
          (review: ReivewData, index: number) => {
            return (
              <div className={classes.result} key={index}>
                <p>{review.name}</p>
                <div className={classes.faceWithCoordinate}>
                  <img src={review.dynamicFaceIcon} alt="" width={90} />
                  <img src={review.canvasImage} alt="" width={120} />
                </div>
                <p>
                  {review.emotions[0]} → {review.emotions[1]} →{" "}
                  {review.emotions[2]} →{review.emotions[3]}
                </p>
              </div>
            );
          }
        )}
      </div>
    );
  };

  return (
    <div>
      {categories.map((category) => {
        return (
          <div>
            <h3>{category}</h3>
            {FilterReviewByCategory(category)}
          </div>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  coordinateArea: {
    margin: "0 auto",
    width: 420,
  },
  result: {
    margin: 10,
    width: 300,
    cursor: "pointer",
    border: "1px solid gray",
    borderRadius: "10%",
    textAlign: "center",
  },
  faceWithCoordinate: {},
  separateByCategoryReview: {
    display: "flex",
    flexWrap: "wrap",
  },
}));

export default Analysis;
