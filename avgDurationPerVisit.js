/**
 * This module provides functions to query average duration statistics.
 * @module avgDurationPerVisit
 */


// connect to the database and then run SQL query. 
const { pool } = require('./db');

/**
 * Returns the average duration of all records in the database.
 * @async
 * @function getAllTimeAverageDuration
 * @returns {Promise<number>} The average duration of all records in the database.
 */
async function getAllTimeAverageDuration() {
  const sql_query = `
  SELECT ROUND(AVG(Cast(duration AS numeric)), 2) AS avg_duration
  FROM cat_data
  `;

  const result = await pool.query(sql_query);
  return result.rows[0].avg_duration;
}


// /** 20230320 Uncommented
//  * Returns the duration on a daily basis .
//  * @async
//  * @function getDailyAverageDuration
//  * @returns {Promise<Array>} The average duration on a daily basis.
//  */
// async function getDailyAverageDuration() {
//     const sql_query = `
//     SELECT date, AVG(duration) AS avg_duration
//     FROM cat_data
//     GROUP BY date
//     ORDER BY date
//     `;

//     const result = await pool.query(sql_query);
//     return result.rows;
//   }

/**
 * Returns the duration with the most recent 1 day data.
 * @async
 * @function getLatestDailyDurations
 * @returns {Promise<Array>} The average duration on a daily basis.
 */
async function getLatestDailyDurations() {
  const sql_query = `
  SELECT entry, duration 
  FROM cat_data 
  WHERE DATE_TRUNC('day', date) = (SELECT DATE_TRUNC('day', date) as latest_date
  FROM cat_data
  ORDER BY date DESC LIMIT 1);
  `;

  const result = await pool.query(sql_query);
  return result.rows;
}


/**
 * Returns the daily average duration per visit with a week's data (modified on 20230321).
 * @async
 * @function getWeeklyAverageDuration
 * @returns {Promise<Array>} Returns the average duration on a weekly basis.
 */
async function getWeeklyAverageDuration() {
  const sql_query = `
  SELECT date, AVG(duration) AS avg_duration
  FROM cat_data
  WHERE date >= (SELECT MAX(date) - INTERVAL '7' DAY FROM cat_data)   
  GROUP BY date
  ORDER BY date;
  `;
  const result = await pool.query(sql_query);
  return result.rows;
}


/**
 * Returns the daily average duration per visit with a month's data (modified on 20230321).
 * @async
 * @function getMonthlyAverageDuration
 * @returns {Promise<Array>} Returns the average duration on a monthly basis.
 */
async function getMonthlyAverageDuration() {
  const sql_query = `
  SELECT date, AVG(duration) AS avg_duration
  FROM cat_data
  WHERE date >= (SELECT MAX(date) - INTERVAL '30' DAY FROM cat_data) 
  GROUP BY date
  ORDER BY date;
  `;
  const result = await pool.query(sql_query);
  console.log(result.rows)
  return result.rows;
}

module.exports = {getLatestDailyDurations, getWeeklyAverageDuration, getMonthlyAverageDuration, getAllTimeAverageDuration}









// not running 20230302:   const chart = new Chart(canvas, {
//                                                  ^
//                 TypeError: Chart is not a constructor

// const { createCanvas } = require('canvas');
//   const { Chart } = require('chartjs-node-canvas');

// async function createChart() { 
//   const data = await getDailyAverageDuration();
//   console.log("data is all  good.")

//   console.log("chart is "+ Chart)
//   const canvas = createCanvas(800, 600);
//   console.log(canvas)
//   const chart = new Chart(canvas, {
//     type: 'bar',
//     data: {
//       labels: data.map((d) => d.date),
//       datasets: [{
//         label: 'Average Duration',
//         data: data.map((d) => d.duration),
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }
//   });
//   const image = chart.canvas.toBuffer();
//   return image;
// }