import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../../Firebase";
import Typography from "@material-ui/core/Typography";
import AppContext from "../contexts/AppContext";

import Button from "@material-ui/core/Button";
import FaceReviewCard from "./FaceReviewCard";

import CoordinateAreaInSearchPage from "./CoordinateAreaInSearchPage";

import DTW from "dtw";

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
  const { state, dispatch } = useContext(AppContext);
  const [name, setName] = useState("");
  const [searchRate, setSearchRate] = useState(null);
  const [isSelectHelpfulReviewMode, setIsSelectHelpfulMode] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [startTime, setStartTime] = useState(0);

  let dtw = new DTW();

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

  const isSimilarTrajectory = (dataX: any, dataY: any): Boolean => {
    if (state.filterDTW.timeSeriesDataX.length === 0) {
      return true;
    }

    let costX = dtw.compute(state.filterDTW.timeSeriesDataX, dataX);
    let costY = dtw.compute(state.filterDTW.timeSeriesDataY, dataY);

    if (costX + costY <= 1000000) {
      return true;
    }

    return false;
  };

  const handleReviewViewEndButtonClick = async () => {
    const sendData: sendData = {
      name,
      reviews: state.readReviewPropose,
      time: performance.now() - startTime,
    };
    const reviewsCollectionReference = firebase
      .firestore()
      .collection("readReviewPropose");
    await reviewsCollectionReference.add(sendData);

    setIsSelectHelpfulMode(true);
  };

  const handleSelectHelpfulReviewEndButtonClick = async () => {
    console.log(state.helpfulReviewPropose);
    const sendData: sendData = {
      name,
      reviews: state.helpfulReviewPropose,
      time: 0,
    };
    const reviewsCollectionReference = firebase
      .firestore()
      .collection("helpfulReviews2");
    await reviewsCollectionReference.add(sendData);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const returnSelectHelpfulModeTemplete = () => {
    if (isSelectHelpfulReviewMode) {
      return (
        <>
          <div className={classes.selectHelpfulHeader}>
            <h2>参考になったと感じるレビューを選択してください。</h2>
          </div>
        </>
      );
    } else {
      return (
        <>
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
            <CoordinateAreaInSearchPage></CoordinateAreaInSearchPage>
          </div>
        </>
      );
    }
  };

  const returnReadButtonTSX = () => {
    if (isSelectHelpfulReviewMode) {
      return (
        <div className={classes.okButton}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSelectHelpfulReviewEndButtonClick}
          >
            <Typography variant="h6" gutterBottom>
              これで終わる
            </Typography>
          </Button>
        </div>
      );
    } else {
      return (
        <div className={classes.okButton}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReviewViewEndButtonClick}
          >
            <Typography variant="h6" gutterBottom>
              レビューを読み終える
            </Typography>
          </Button>
        </div>
      );
    }
  };

  return (
    <>
      {returnSelectHelpfulModeTemplete()}
      <div className={classes.content}>
        <div className={classes.left}>
          <div className={classes.reviewHeader}>
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              style={{ fontWeight: "bold" }}
            >
              乗り遅れた旅人
            </Typography>
          </div>
          <div className={classes.reviewList__under}>
            {reviews.map((review, index) => {
              if (
                review.movieTitle === "yokohama" &&
                isSimilarTrajectory(review.dataX, review.dataY)
              ) {
                return (
                  <div className={classes.reviewList__border} key={index}>
                    <FaceReviewCard
                      isSelectHelpfulReviewMode={isSelectHelpfulReviewMode}
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
          <div className={classes.reviewHeader}>
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              style={{ fontWeight: "bold" }}
            >
              シェークスピア・イン・トーキョー
            </Typography>
          </div>
          <div className={classes.reviewList__under}>
            {reviews.map((review, index) => {
              if (
                review.movieTitle === "shakespeare" &&
                isSimilarTrajectory(review.dataX, review.dataY)
              ) {
                return (
                  <div className={classes.reviewList__border} key={index}>
                    <FaceReviewCard
                      isSelectHelpfulReviewMode={isSelectHelpfulReviewMode}
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

      {returnReadButtonTSX()}
    </>
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
    borderLeft: "1px black solid",
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
    height: 350,
  },
  selectHelpfulHeader: {
    textAlign: "center",
    margin: "0 auto",
    height: 30,
    marginTop: 20,
  },
  reviewHeader: {
    backgroundColor: "white",
    position: "sticky",
    height: 60,
    top: 0,
    fontWeight: "bold",
    paddingTop: 13,
  },
}));

export default SelectMoviePropose;
