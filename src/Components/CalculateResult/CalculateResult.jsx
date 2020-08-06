import React, { Component } from "react";
import moment from "moment";
import { csv, timeParse } from "d3";
import data from "../../assets/SampleRate.csv";

class CalculateResult extends Component {
  state = { rateA: null, rateB: null };

  //Async request area
  componentDidMount() {
    csv(data)
      .then((data) => {
        let intermediateResult = [];

        for (let [idx, eachRow] of Object.entries(data)) {
          let tempResult = {};
          let tempVal = 0;

          //ignoring headers in calculation
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

              // tempResult["time"] = parseTime(time);
            } else {
              tempVal += parseFloat(value);
            }
            tempResult["totalValue"] = tempVal;
          }
          intermediateResult.push(tempResult);
        }

        // Calculation of rate A i.e B1 for Rate A
        // console.log(intermediateResult[2].date.hours());
        let totalTempValueRateA = 0;
        for (let { totalValue: rateA } of Object.values(intermediateResult)) {
          totalTempValueRateA += rateA;
          // console.log(totalTempValueRateA);
        }

        const rateAMultiplier = 0.15;
        let finalRateA = totalTempValueRateA * rateAMultiplier;

        // Rate B
        const dayRateMultiplier = 0.2;
        const nightRateMultiplier = 0.08;

        const peakDayTime = moment("12:00:00", "hh:mm:ss");
        const peakEvenTime = moment("18:00:00", "hh:mm:ss");

        let finalRatB = 0;
        for (let { date, totalValue } of Object.values(intermediateResult)) {
          if (
            peakDayTime.hours() <= date.hours() &&
            date.hours() <= peakEvenTime.hours()
          ) {
            finalRatB += totalValue * dayRateMultiplier;
          } else {
            finalRatB += totalValue * nightRateMultiplier;
          }
        }
        console.log(finalRatB);

        this.setState({ rateA: finalRateA, rateB: finalRatB });
      })

      .catch((err) => console.log("File not found", err));
  }
  render() {
    return <div></div>;
  }
}

export default CalculateResult;
