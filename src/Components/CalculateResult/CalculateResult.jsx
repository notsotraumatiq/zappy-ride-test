import React, { Component } from "react";
import moment from "moment";
import { csv } from "d3";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import data from "../../assets/SampleRate.csv";
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
    ratAWithEV: null,
    rateBWithEV: null,
    billImpactA: null,
    billImpactB: null,
    loading: true,
    miles: 0,
    value: ["1:00", "12:00"],
  };

  handleCalculation = () => {
    let { miles, rateAWithoutEV, rateBWithoutEV, value } = this.state;
    miles = parseInt(miles);
    let userTimeStart = moment(value[0], "hh:mm");
    let userTimeEnd = moment(value[1], "hh:mm");

    // remember to convert 00:00 to 24 for both

    const milesKWHMultiplier = 0.3;

    const rateAMultiplier = 0.15;

    const rateAWithEV =
      rateAWithoutEV + miles * milesKWHMultiplier * rateAMultiplier;
    console.log(rateAWithEV);
    const differenceInRateA = rateAWithEV - rateAWithoutEV;

    // Calculating B2
    const dayRateMultiplier = 0.2;
    const nightRateMultiplier = 0.08;

    const numberOfHoursToCharge = Math.abs(
      parseInt(userTimeEnd.hours()) - parseInt(userTimeStart.hours())
    );

    const timeDuration = [userTimeStart.hours(), userTimeEnd.hours()];

    let rateBWithEV = 0;
    // between 12pm - 6 pm

    if (
      timeDuration[0] >= 12 &&
      timeDuration < 18 &&
      (timeDuration[1] > 12 || timeDuration[1] <= 18) &&
      timeDuration[0] < timeDuration[1]
    ) {
      //  12  13
      // 1pm  1 pm
      console.log("12 - 6");
      rateBWithEV =
        rateBWithoutEV + miles * dayRateMultiplier * milesKWHMultiplier;
    } else if (
      (timeDuration[0] <= 12 || timeDuration[0] >= 18) &&
      (timeDuration[1] >= 18 || timeDuration[1] <= 12)
    ) {
      // between 6pm - 12pm

      rateBWithEV =
        rateBWithoutEV + miles * nightRateMultiplier * milesKWHMultiplier;
      console.log("6- 24");
    } else {
      // Either the start or the end overlaps so we take the ratio

      let peakHours = [12, 13, 14, 15, 16, 17];
      let startH = 0;
      let start = userTimeStart.hours();
      let end = userTimeEnd.hours();

      let startCounter = start;
      for (let i = 0; i < peakHours.length; i++) {
        if (start <= peakHours[i]) {
          startH += 1;
        }
      }

      let endR = Math.abs(numberOfHoursToCharge - startH);

      const dayRatio = startH / numberOfHoursToCharge;
      const nightRatio = endR / numberOfHoursToCharge;

      rateBWithEV =
        rateBWithoutEV +
        miles * dayRatio * milesKWHMultiplier * dayRateMultiplier +
        miles * nightRatio * milesKWHMultiplier * nightRateMultiplier;
    }
    const differenceInRateB = rateBWithEV - rateBWithoutEV;
    this.setState({
      ratAWithEV: rateAWithEV,
      rateBWithEV: rateBWithEV,
      billImpactA: differenceInRateA,
      billImpactB: differenceInRateB,
    });
  };

  //Async request area
  componentDidMount() {
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
    let displayResult = null;
    const A = this.state.billImpactA;
    const B = this.state.billImpactB;
    if (A && B) {
      if (
        (A > B && this.props.options === 2) ||
        (A < B && this.props.options === 1)
      ) {
        displayResult = <p>You are on the cheapest Rate</p>;
      } else if (A > B && this.props.options === 1) {
        displayResult = (
          <p>You shall get better rates if you switch to Rate B</p>
        );
      } else {
        displayResult = (
          <p>You shall get better rates if you switch to Rate A</p>
        );
      }
    }
    return (
      <div>
        {this.state.loading ? (
          <BeatLoader css={override} color={"#36D7B7"} />
        ) : null}
        <label className={classes.Label} htmlFor="milesDrive">
          Miles Driven:
          <input
            className={classes.Input}
            type="number"
            placeholder="Miles Driven"
            onChange={(event) => {
              this.setState({ miles: event.target.value });
            }}
            value={this.state.miles}
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

        <button
          onClick={this.handleCalculation}
          className={classes.Button}
          disabled={this.props.options === null ? true : false}
        >
          Calculate{" "}
        </button>

        {displayResult && (
          <div>
            {" "}
            <p>Your Bill Impact with EV under each Rates are</p>
            <ul>
              <li>
                <p>
                  Rate A :{" "}
                  <strong> {this.state.ratAWithEV.toFixed(2)} USD </strong>
                </p>
                <p>
                  Bill impact for rate A{" "}
                  <strong> {this.state.billImpactA.toFixed(2)} USD </strong>
                </p>
              </li>
              <li>
                <p>
                  Rate B :{" "}
                  <strong> {this.state.rateBWithEV.toFixed(2)} USD </strong>
                </p>
                <p>
                  Bill impact for rate A{" "}
                  <strong> {this.state.billImpactB.toFixed(2)} USD </strong>
                </p>
              </li>
            </ul>
            <div>
              <p>Based on the above analysis </p>
              {displayResult}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CalculateResult;
