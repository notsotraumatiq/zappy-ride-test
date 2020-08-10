import React, { Component } from "react";
import moment from "moment";
import { csv } from "d3";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import data from "../../assets/SampleRate.csv";
import MilesPerYear from "../MilesPerYear/MilesPerYear";
import classes from "./CalculateResult.module.css";
import TimeRangePicker from "@wojtekmaj/react-timerange-picker";

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

class CalculateResult extends Component {
  state = {
    rateAWithoutEV: null,
    rateBWithoutEV: null,
    totalDayRateB: null,
    totalNightRateB: null,
    loading: true,
    miles: "",
    value: ["1:00", "12:00"],
  };

  handleCalculation = () => {
    let { option } = this.props;
    let { miles, rateAWithoutEV, rateBWithoutEV, value } = this.state;
    const userTimeStart = moment(value[0], "hh:mm");
    const userTimeEnd = moment(value[1], "hh:mm");
    console.log(userTimeStart.hours(), userTimeEnd);
    // Converting Miles per year to miles per hour and Calculating B2 for Rate A and B

    // const milesDrivenPerDay = miles / 365;

    const milesKWHMultiplier = 0.3;

    const rateAMultiplier = 0.15;

    const rateAWithEV =
      rateAWithoutEV + miles * milesKWHMultiplier * rateAMultiplier;

    const differenceInRateA = rateAWithEV - rateAWithoutEV;

    // Calculating B2
    const dayRateMultiplier = 0.2;
    const nightRateMultiplier = 0.08;

    // 12000 * 0.3 ratio day total night total
    const numberOfHoursToCharge = value[1] - value[0];
    if (value[0] >= 12 && value[1] <= 18) {
      const rateBWithEV = miles * dayRateMultiplier * milesKWHMultiplier;
    } else {
      if (value[0] >= 18 && value[1] <= 12) {
        const rateBWithEV = miles * nightRateMultiplier * milesKWHMultiplier;
      } else {
      }
    }
  };

  //Async request area
  componentDidMount() {
    console.log("eesdfhd");
    csv(data)
      .then((data) => {
        let intermediateResult = [];

        for (let [idx, eachRow] of Object.entries(data)) {
          let tempResult = {};
          let tempVal = 0;

          //ignoring headers in data file
          if (idx === "columns") {
            continue;
          }

          for (let [key, value] of Object.entries(eachRow)) {
            if (key === "Date/Time") {
              // Converting it into date time object for better readability and future comparisions

              tempResult["date"] = moment(
                eachRow[key].trim(),
                "MM/DD  hh:mm:ss"
              );
            } else {
              tempVal += parseFloat(value);
            }
            tempResult["totalValue"] = tempVal;
          }
          intermediateResult.push(tempResult);
        }

        // Calculation of rate A i.e B1 for Rate A

        let totalTempValueRateA = 0;
        for (let { totalValue: rateAWithoutEV } of Object.values(
          intermediateResult
        )) {
          totalTempValueRateA += rateAWithoutEV;
        }

        const rateAMultiplier = 0.15;
        let finalRateA = totalTempValueRateA * rateAMultiplier;

        // Rate B
        const dayRateMultiplier = 0.2;
        const nightRateMultiplier = 0.08;

        const peakDayTime = moment("12:00:00", "hh:mm:ss");
        const peakEvenTime = moment("18:00:00", "hh:mm:ss");
        let tempDayRateB = 0;
        let tempNightRateB = 0;
        let finalRateB = 0;
        for (let { date, totalValue } of Object.values(intermediateResult)) {
          if (
            peakDayTime.hours() <= date.hours() &&
            date.hours() <= peakEvenTime.hours()
          ) {
            tempDayRateB += totalValue;
            finalRateB += totalValue * dayRateMultiplier;
          } else {
            tempNightRateB += totalValue;
            finalRateB += totalValue * nightRateMultiplier;
          }
        }
        // console.log(finalRateB);

        this.setState({
          rateAWithoutEV: finalRateA,
          rateBWithoutEV: finalRateB,
          loading: false,
          totalDayRateB: tempDayRateB,
          totalNightRateB: tempNightRateB,
        });
      })

      .catch((err) => console.log("File not found", err));
  }
  render() {
    return (
      <div>
        {this.state.loading ? (
          <BeatLoader css={override} color={"#36D7B7"} />
        ) : null}
        <label htmlFor="milesDrive">
          Miles Driven
          <input
            type="number"
            placeholder="Miles Driven"
            onChange={(event, object) => {
              console.log(object);
            }}
          />
        </label>
        <h3>What are the hours do you plan to charge ?</h3>

        <TimeRangePicker
          onChange={(event) => this.setState({ value: event })}
          value={this.state.value}
          maxDetail={"hour"}
          required={true}
          clearIcon={null}
        />

        <button onClick={this.handleCalculation}>Calculate </button>

        <div>
          {" "}
          <p>Your Bill Impact with EV under each Rates are</p>
          <ul>
            <li>
              <p>
                Rate A : <strong> {} </strong>
              </p>
            </li>
            <li>
              <p>
                Rate B : <strong> {} </strong>
              </p>
            </li>
          </ul>
          <p>Based on the above analysis </p>
        </div>
      </div>
    );
  }
}

export default CalculateResult;
