import React, { Component } from "react";

class MilesPerYear extends Component {
  state = { input: "" };
  render() {
    return (
      <div>
        <label htmlFor="milesDrive">
          {" "}
          Miles Driven
          <input
            type="text"
            placeholder="Miles Driven"
            onChange={(event) => this.setState({ input: event.target.value })}
          />
        </label>
      </div>
    );
  }
}

export default MilesPerYear;
