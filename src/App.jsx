import React, { Component } from "react";
import Rates from "./Components/Rates/Rates";
import CalculateResult from "./Components/CalculateResult/CalculateResult";
import TimeDuration from "./Components/TimeDuration/TimeDuration";
import MilesPerYear from "./Components/MilesPerYear/MilesPerYear";
import classes from "./App.module.css";

class App extends Component {
  state = {};
  render() {
    return (
      <>
        <div className={classes.App}>EV CHARGING APP</div>
        <Rates />
        <CalculateResult />
      </>
    );
  }
}

export default App;
