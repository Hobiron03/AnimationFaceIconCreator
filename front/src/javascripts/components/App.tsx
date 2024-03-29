import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useReducer, useState } from "react";
import AppContext from "../contexts/AppContext";
import reducer from "../reducers";

import ReviewTable from "./ReviewTable";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";

import CoordinateArea from "./CoordinateArea";
import FreeReviewPage from "./FreeReviewPage";
import NormalCoordinateArea from "./NormalCoordinateArea";
import FreeDescriptionReview from "./FreeDescriptionReview";
import ProposeMethodReivewTable from "../components/ProposeMethodReivewTable";

import SelectMovieNormal from "./SelectMovieNormal";
import SelectMoviePropose from "./SelectMoviePropose";
import Analysis from "./Analysis";
import SelectThingsNormal from "./SelectThingsNormal";
import SelectThingsPropose from "./SelectThingsPropose";

const App = () => {
  const initialState = {
    filterEmotion: "",
    filterFaceIcon: [],
    filterDTW: { timeSeriesDataX: [], timeSeriesDataY: [] },
    helpfulReview: [],
    readReviewPropose: [],
    helpfulReviewPropose: [],
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const classes = useStyles();

  const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

  const OpenReviewModal = () => {
    setIsOpenReviewModal(true);
  };

  const CloseReviewModal = () => {
    setIsOpenReviewModal(false);
  };

  const ReivewContent = () => {
    return (
      <div>
        <CoordinateArea></CoordinateArea>
      </div>
    );
  };

  const ModalBody = <div className={classes.paper}>{ReivewContent()}</div>;

  const ReivewModal = () => {
    if (isOpenReviewModal) {
      return (
        <Modal
          open={isOpenReviewModal}
          onClose={CloseReviewModal}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {ModalBody}
        </Modal>
      );
    }
  };

  const ReivewScreen = (
    <div className="App">
      <div className="ReivewArea">
        <h3>{"商品やサービス"} レビュー一覧</h3>
        <div className="filterButtons">
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={() => HandleFilterByEmotionButtonOnClick("Angry")}
          >
            怒り
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => HandleFilterByEmotionButtonOnClick("Sad")}
          >
            悲しみ
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => HandleFilterByEmotionButtonOnClick("Happy")}
          >
            喜び
          </Button>
          <Button
            variant="contained"
            color="inherit"
            onClick={() => HandleFilterByEmotionButtonOnClick("Pleasure")}
          >
            楽しみ
          </Button> */}
          <Button
            variant="contained"
            color="inherit"
            onClick={() => OpenReviewModal()}
          >
            顔検索
          </Button>
        </div>
        {ReivewModal()}

        <ReviewTable></ReviewTable>
      </div>
    </div>
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <Router>
        <Switch>
          <Route path="/select-things-normal">
            <SelectThingsNormal></SelectThingsNormal>
          </Route>
          <Route path="/select-things-propose">
            <SelectThingsPropose></SelectThingsPropose>
          </Route>
          <Route path="/select-movie-normal">
            <SelectMovieNormal></SelectMovieNormal>
          </Route>
          <Route path="/select-movie-propose">
            <SelectMoviePropose></SelectMoviePropose>
          </Route>
          <Route path="/reviews-table">{ReivewScreen}</Route>
          <Route path="/new-face-reviews">
            <ProposeMethodReivewTable></ProposeMethodReivewTable>
          </Route>
          <Route path="/analysis">
            <Analysis></Analysis>
          </Route>
          <Route path="/free-review">
            <FreeDescriptionReview></FreeDescriptionReview>
          </Route>
          <Route path="/review-normal">
            <FreeReviewPage></FreeReviewPage>
          </Route>
          <Route path="/review">
            {/* <ReviewsResult></ReviewsResult> */}
            <CoordinateArea></CoordinateArea>
          </Route>
          <Route path="/">
            {/* <ReviewsResult></ReviewsResult> */}
            <NormalCoordinateArea></NormalCoordinateArea>
          </Route>
        </Switch>
      </Router>
    </AppContext.Provider>
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
}));

export default App;
