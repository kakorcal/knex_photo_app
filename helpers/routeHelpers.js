const _ = require('lodash');

module.exports = {
  assignFormattedDate(arr){
    // TODO: Add tests to check if array is being inputted
    return _.map(arr, cur=>{
      const mmddyear = new Date().toString().match(/[a-zA-Z]{3} \d{2} \d{4}/)[0];
      return _.assignIn(cur, {date: mmddyear});
    });
  }
};