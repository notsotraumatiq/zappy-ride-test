import React, { Component } from "react";
import CalculateResult from "./Components/CalculateResult/CalculateResult";
import classes from "./App.module.css";
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
            className={
              this.state.option === 1
                ? classes.Button + " " + classes.Active
                : classes.Button
            }
            onClick={() => this.setState({ option: 1 })}
          >
            Rate A: Flat Rate
          </button>
          <button
            className={
              this.state.option === 2
                ? classes.Button + " " + classes.Active
                : classes.Button
            }
            onClick={() => this.setState({ option: 2 })}
          >
            Rate B: Time of use
          </button>

          <CalculateResult options={this.state.option} />
        </div>
      </>
    );
  }
}
export default App;
