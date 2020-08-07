import React, { Component } from "react";
import Rates from "./Components/Rates/Rates";
import CalculateResult from "./Components/CalculateResult/CalculateResult";
import TimeDuration from "./Components/TimeDuration/TimeDuration";
import MilesPerYear from "./Components/MilesPerYear/MilesPerYear";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import classes from "./App.module.css";

const override = css`
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 4em;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;
class App extends Component {
  state = { loading: true };

  render() {
    return (
      <>
        <div className={classes.App}>EV CHARGING APP</div>
        {this.state.loading ? (
          <BeatLoader css={override} color={"#36D7B7"} />
        ) : null}
        <Rates />
        <CalculateResult />
      </>
    );
  }
}

export default App;
