import React, { Component } from "react";

import { csv } from "d3";
import data from "../../assets/SampleRate.csv";

class CalculateResult extends Component {
  state = { csvFile: null };

  //Async request area
  componentDidMount() {
    csv(data)
      .then((data) => {
        let intermediateResult = [];

        for (let object of Object.values(data)) {
          // console.log(object);
          let tempResult = {};
          let tempVal = 0;

          for (let [key, value] of Object.entries(object)) {
            // console.log(key + " " + value);
            if (key === "Date/Time") {
              //convert into date time object
              tempResult["Date/Time"] = new Date(object[key]);
            } else {
              tempVal += parseFloat(value);
            }
            tempResult["totalValue"] = tempVal;
          }
          intermediateResult.push(tempResult);
          // console.log(intermediateResult);
          // key are indexs, value are the objects
          // if (key === "columns") {
          //   continue;
          // }
          // for (let [k, v] of Object.entries(value)) {
          //   if (k === "Date/Time") {
          //     let [date, time] = v.trim().split("  ");
          //     tempResult["time"] = time;
          //     tempResult["date"] = date;
          //     // console.log(date, time);
          //   } else {
          //     tempVal += parseFloat(v);
          //   }
          //   tempResult["totalValue"] = tempVal;
          // }
          // intermediateResult.push(tempResult);
        }
        // Calculation of rate A i.e B1 for Rate A
        console.log(intermediateResult[12]);
        let totalTempValueRateA = 0;
        for (let { totalValue: rateA } of Object.values(intermediateResult)) {
          totalTempValueRateA += rateA;
        }
        let finalRateA = totalTempValueRateA * 0.15;

        // Rate B
        const dayRate = 0.2;
        const nightRate = 0.08;

        for (let { time, date, totalValue } of Object.values(
          intermediateResult
        )) {
          // if time
        }
        // console.log(finalRateA);
      })

      // this.setState({ csvFile: result });

      .catch((err) => console.log("File not found", err));
  }
  render() {
    return <div></div>;
  }
}

export default CalculateResult;
