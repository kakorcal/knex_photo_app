const _ = require('lodash');

// TODO: Add tests to check if array is being inputted
module.exports = {
  assignFormattedDate(arr){
    return _.map(arr, cur=>{
      const mmddyear = new Date().toString().match(/[a-zA-Z]{3} \d{2} \d{4}/)[0];
      return _.assign(cur, {date: mmddyear});
    });
  },
  assignPhotoCount(arr){
    const photoCount = _.reduce(arr, (acc, cur)=>{
      if(!acc[cur.id]){
        if(cur.photo_name){
          acc[cur.id] = [cur.photo_name];
        }else{
          acc[cur.id] = [];
        }
      }else{
        acc[cur.id].push(cur.photo_name);
      }
      return acc;
    }, {});

    return _.uniqBy(arr, cur=>cur.username).map(cur=>{
      return _.assign(
        _.omit(cur,'photo_name'), 
        {photos: photoCount[cur.id].join(', '), count: photoCount[cur.id].length}
      );
    });
  }
};