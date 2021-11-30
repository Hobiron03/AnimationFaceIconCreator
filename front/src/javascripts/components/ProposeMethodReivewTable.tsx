import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "../contexts/AppContext";
import firebase from "../../../Firebase";

type FetchedReviewData = {
  name: string;
  movieTitle: string;
  animationFaceIcon: string;
  title: string;
  staticFaceIcon: string[];
  reviews: string[];
  coordinateImage: string;
  dataX: number[];
  dataY: number[];
  writeMTime: number;
  mTime: number;
};

const ProposeMethodReivewTable = () => {
  const classes = useStyles();
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState<FetchedReviewData>({
    name: "",
    movieTitle: "",
    animationFaceIcon: "",
    title: "",
    staticFaceIcon: [],
    reviews: [],
    coordinateImage: "",
    dataX: [],
    dataY: [],
    writeMTime: 0,
    mTime: 0,
  });

  useEffect(() => {
    fetchReviewData();
  }, []);

  const fetchReviewData = async () => {
    const snapshot = await firebase
      .firestore()
      .collection("NewFaceIconReviewData")
      .get();
    const reviews = snapshot.docs.map((doc) => doc.data());
    setReviews(reviews);
  };

  const handleDisplayReviewData = () => {
    console.log("Hello, Reivew");
    console.log(reviews);
  };

  return (
    <div>
      <div className={classes.proposeMethodReivewTable}>
        <h1>Popose Method Reivew Table</h1>
        {reviews.map((review, index) => {
          return (
            <div className={classes.review} key={index}>
              <img
                src={review.animationFaceIcon}
                alt=""
                className={classes.review_img}
              />
              <p className={classes.review_p}>{review.title}</p>
              <div className={classes.review_content}>
                {review.reviews.map((sentence, index) => {
                  return (
                    <div>
                      <img
                        src={review.staticFaceIcon[index]}
                        alt=""
                        width={60}
                      />
                      <p>{sentence}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  proposeMethodReivewTable: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
  },
  review: {
    display: "flex",
    alignItems: "center",
    marginTop: 25,
  },
  review_img: {
    width: 80,
  },
  review_p: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  review_content: {
    borderTop: "solid 1px black",
    borderBottom: "solid 1px black",
  },
  paper: {
    width: 1200,
    margin: "30px auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  reviewTable: {
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    width: 1400,
  },
}));

export default ProposeMethodReivewTable;
