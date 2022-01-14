import * as React from "React";
import { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import AppContext from "../contexts/AppContext";

import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const FaceIconReivewModal = ({
  isSelectMovieModalOpen,
  handleSelectMovieModalOpen,
  handleSelectMovieModalClose,
}) => {
  const classes = useStyles();

  const [state, setState] = useState({
    gilad: true,
    jason: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleSelectMovieOkButtonClick = () => {
    if (error) {
      return;
    }

    const url = `https://docs.google.com/forms/d/e/1FAIpQLScqODauUUCizQ8FbCfHfM9v8Cj7jbn9pTZ_hs-S7rp-eTW1_Q/viewform?usp=pp_url&entry.636376960=${name}`;
    window.open(url, "_blank");

    handleSelectMovieModalClose();
  };

  const { gilad, jason } = state;
  const error = [gilad, jason].filter((v) => v).length !== 1;

  return (
    <Modal
      open={isSelectMovieModalOpen}
      onClose={handleSelectMovieModalClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      style={{ overflow: "scroll" }}
    >
      <div className={classes.paper}>
        <div className={classes.paper__title}>
          <h3>どちらの動画を見たいか選択してください</h3>
        </div>

        <div className={classes.paper__content}>
          <FormControl
            required
            error={error}
            component="fieldset"
            className={classes.formControl}
          >
            {/* <FormLabel component="legend">
              どちらの動画を見たいか選択してください。
            </FormLabel> */}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gilad}
                    onChange={handleChange}
                    name="gilad"
                  />
                }
                label="乗り遅れた旅人"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={jason}
                    onChange={handleChange}
                    name="jason"
                  />
                }
                label="シェークスピア・イン・トーキョー"
              />
            </FormGroup>
            <FormHelperText>
              見たいと思う動画を一つ選択してください。
            </FormHelperText>
          </FormControl>

          <div>
            <Button
              variant="contained"
              color="primary"
              className={classes.paper__content__okButton}
              onClick={handleSelectMovieOkButtonClick}
            >
              <Typography>これでOK</Typography>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 900,
    margin: "70px auto",
    borderRadius: 10,
    backgroundColor: theme.palette.background.paper,
    padding: "30px 25px 15px 25px",
  },
  paper__title: {
    textAlign: "center",
  },
  paper__content: {
    textAlign: "center",
  },
  paper__content__okButton: {
    marginTop: 30,
    width: 300,
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default FaceIconReivewModal;
