import * as _ from "lodash";

function messageFormatter(drinkData: any) {
  let msg = "";
  for (var key in drinkData) {
    var drinkCounts = _.countBy(drinkData[key], "drinkname");
    msg += `${key} has had `;
    let idx = 1;
    for (var key in drinkCounts) {
      if (drinkCounts.length === 1) {
        msg += `a ${key}`;
      } else {
        if (drinkCounts[key] === 1) {
          msg += `a ${key}`;
        } else {
          msg += `${drinkCounts[key]} ${key}s`;
        }
        if (idx < _.size(drinkCounts)) {
          msg += `, and `;
        }
      }
      idx++;
    }
    msg += `.\n`;
  }
  return msg;
}

export { messageFormatter };
