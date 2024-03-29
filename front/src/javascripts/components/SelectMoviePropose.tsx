import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import firebase from "../../../Firebase";
import Typography from "@material-ui/core/Typography";
import AppContext from "../contexts/AppContext";
import { FILTER_BY_DTW } from "../actions";

import Button from "@material-ui/core/Button";
import FaceReviewCard from "./FaceReviewCard";
import CoordinateAreaInSearchPage from "./CoordinateAreaInSearchPage";
import SelectMovieModal from "./SelectMovieModal";
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
  const [isSelectMovieModalOpen, setIsSelectMovieModalOpen] = useState(false);
  const [isExperimentEnd, setIsExperimtneEnd] = useState(false);

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

  const handleSelectMovieModalOpen = () => {
    // toggleModalState();
    // setIsModalOpen(false);
    setIsSelectMovieModalOpen(true);
  };

  const handleSelectMovieModalClose = () => {
    setIsSelectMovieModalOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    handleResetButtonClick();
    setIsSelectHelpfulMode(true);
    // handleSelectMovieModalOpen();
    const url = `https://docs.google.com/forms/d/1VNTzDaoRHcTHD3FCNcpcFIY12d9HixKAJFG1kDQHBbo/edit?https://docs.google.com/forms/d/e/1FAIpQLScqODauUUCizQ8FbCfHfM9v8Cj7jbn9pTZ_hs-S7rp-eTW1_Q/viewform?usp=pp_url&entry.636376960=${name}`;
    window.open(url, "_blank");
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

    setIsExperimtneEnd(true);
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  const handleResetButtonClick = () => {
    dispatch({
      type: FILTER_BY_DTW,
      timeSeriesData: { timeSeriesDataX: [], timeSeriesDataY: [] },
    });
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
            <div className={classes.searchRate__header}>
              <h3>顔アイコン検索</h3>
              <Button
                variant="contained"
                onClick={handleResetButtonClick}
                className={classes.searchRate__header__resetButton}
              >
                リセット
              </Button>
            </div>
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

  return isExperimentEnd ? (
    <>
      <div className={classes.thanks}>
        <Typography variant="h4" gutterBottom>
          ありがとうございました。
        </Typography>
        <Typography variant="h5" gutterBottom>
          これで実験は終了です。
        </Typography>
      </div>
    </>
  ) : (
    <>
      <SelectMovieModal
        isSelectMovieModalOpen={isSelectMovieModalOpen}
        handleSelectMovieModalClose={handleSelectMovieModalClose}
        handleSelectMovieModalOpen={handleSelectMovieModalOpen}
      ></SelectMovieModal>
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
  thanks: {
    marginTop: 100,
    textAlign: "center",
  },
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
  searchRate__header: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  searchRate__header__resetButton: {
    marginLeft: 20,
    height: 40,
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
