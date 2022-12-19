const db = require('../connection');

const getTodos = () => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        [
          {
            "memo_details": "The Hobbit",
            "date_added": "2022-12-17 12: 30: 55",
            "category_id": 3,
            "user_id": 5,
            "completion_status": false
          },
          {
            "memo_details": "Fellowship of the Ring",
            "date_added": "2022-12-17 12: 30: 55",
            "category_id": 3,
            "user_id": 5,
            "completion_status": false
          },
          {
            "memo_details": "The Notebook",
            "date_added": "2022-12-17 12: 30: 55",
            "category_id": 3,
            "user_id": 5,
            "completion_status": true
          }
        ]
      );
    }, 300);
  });


  // return db.query('SELECT * FROM todo_items;')
  //   .then(data => {
  //     console.log('DATA HERE');
  //     return data.rows;

  //   });
};

module.exports = { getTodos };
