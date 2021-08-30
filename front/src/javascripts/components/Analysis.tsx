import * as React from "React";
import { useState, useEffect, useContext } from "react";
import firebase from "../../../Firebase";

interface ReivewData {
  name: string;
  dynamicFaceIcon: string;
  title: string;
  canvasImage: string;
  EmotionalFaceIcon: Array<string>;
  comments: Array<string>;
  emotions: Array<string>;
}

const Analysis = () => {
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState<ReivewData>({
    name: "",
    dynamicFaceIcon: "",
    title: "",
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

  return (
    <div>
      <p>Analysis Screen</p>
      {reviews.map((review: ReivewData, index: number) => {
        return (
          <div>
            <p>{review.name}</p>
            <p>{review.title}</p>
            <img src={review.dynamicFaceIcon} alt="" />
            <img src={review.canvasImage} alt="" width={200} />
            <p>
              {review.emotions[0]} → {review.emotions[1]} →{review.emotions[3]}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Analysis;
