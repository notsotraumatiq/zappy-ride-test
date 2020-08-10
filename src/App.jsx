import React, { Component } from "react";
import Rates from "./Components/Rates/Rates";
import CalculateResult from "./Components/CalculateResult/CalculateResult";
import TimeDuration from "./Components/TimeDuration/TimeDuration";
import MilesPerYear from "./Components/MilesPerYear/MilesPerYear";
import classes from "./App.module.css";
import { AwesomeButton } from "react-awesome-button";
// import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";
import "react-awesome-button/dist/styles.css";
import { css } from "@emotion/core";

class App extends Component {
  state = { option: null };

  render() {
    return (
      <>
        <div className={classes.App}>
          <h1>EV CHARGING APP</h1>
          <h2>Whats your current Plan</h2>
          <button
            className={classes.Button}
            onClick={() => this.setState({ option: 1 })}
          >
            Rate A: Flat Rate
          </button>
          <button
            className={classes.Button}
            onClick={() => this.setState({ option: 2 })}
          >
            Rate B: Time of use
          </button>
          <Rates />
          <CalculateResult options={this.state.option} />
        </div>
      </>
    );
  }
}

export default App;
