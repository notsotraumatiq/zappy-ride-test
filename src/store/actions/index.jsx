import { csv } from "d3";

export const loadData = (data) => {
  csv(data)
    .then((data) => {
      let result = [];

      for (let [key, value] of Object.entries(data)) {
        let tempResult = {};
        let tempVal = 0;

        // key are indexs, value are the objects
        if (key === "columns") {
          continue;
        }

        for (let [k, v] of Object.entries(value)) {
          if (k === "Date/Time") {
            let [date, time] = v.trim().split("  ");
            tempResult["time"] = time;
            tempResult["date"] = date;
          } else {
            tempVal += parseFloat(v);
          }
          tempResult["totalValue"] = tempVal;
        }
        result.push(tempResult);
      }
      this.setState({ csvFile: result });
    })
    .catch((err) => console.log("File not found", err));
};
