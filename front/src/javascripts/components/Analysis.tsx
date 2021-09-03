import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

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

  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

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

  const CloseReviewModal = () => {
    setIsOpenReviewModal(false);
  };

  const OpenReviewModal = (review) => {
    setReview(review);
    setIsOpenReviewModal(true);
  };

  const ReivewContent = () => {
    return (
      <div>
        <div className="c-modal_content_inner__header">
          <div className="c-modal_content_inner__header__faceicon">
            <img src={review.dynamicFaceIcon} alt="" />
          </div>
          <div className="c-modal_content_inner__header__title">
            <h2>{review.title}</h2>
          </div>
        </div>

        {/* レビューの詳細かな */}
        {review.EmotionalFaceIcon.map((faceIcon, index) => {
          return (
            <div className="c-modal_content_inner__content">
              <div className="c-modal_content_inner__content__columns">
                <div className="c-modal_content_inner__content__columns__faceicon">
                  <img src={faceIcon} alt="" />
                </div>
                <div className="c-modal_content_inner__content__columns__comment">
                  {/* index = 0はタイトルの文章が入っている */}
                  <p>{review.comments[index + 1]}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ReivewModal = () => {
    if (isOpenReviewModal) {
      return (
        <Modal
          open={isOpenReviewModal}
          onClose={CloseReviewModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div className={classes.paper}>{ReivewContent()}</div>
        </Modal>
      );
    }
  };

  const FilterReviewByCategory = (category) => {
    return (
      <div className={classes.separateByCategoryReview}>
        {FilterReviewByMovieTitles(category).map(
          (review: ReivewData, index: number) => {
            return (
              <div
                className={classes.result}
                key={index}
                onClick={() => OpenReviewModal(review)}
              >
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
      {ReivewModal()}
      {categories.map((category) => {
        return (
          <div className={classes.area}>
            <h3>{category}</h3>
            {FilterReviewByCategory(category)}
          </div>
        );
      })}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 1200,
    margin: "30px auto",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  result: {
    margin: 10,
    width: 300,
    cursor: "pointer",
    border: "0.5px solid gray",
    borderRadius: "10%",
    textAlign: "center",
    transition: "all 0.2s",
    boxShadow: "0 5px 10px 0 rgba(0, 0, 0, 0.2)",
    "&:hover": {
      transform: "scale(1.03, 1.03)",
    },
  },
  area: {
    marginBottom: 100,
  },
  faceWithCoordinate: {},
  separateByCategoryReview: {
    display: "flex",
    flexWrap: "wrap",
  },
}));

export default Analysis;
