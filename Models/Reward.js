var query = require("./connection");

const createReward = async (type, amount, bonus, user_id) => {
  try {
    var rows = await query(
      `INSERT INTO reward (user_id, time, amount, bonus, type) VALUES (${user_id}, CURRENT_TIME(), ${amount}, ${bonus}, '${type}')`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getRandomBonus = async (user_id) => {
  try {
    const rows = await query(
      `SELECT bonus, TIMESTAMPDIFF(SECOND, time, NOW()) as remain_time from reward WHERE state = 1 and type = 'random' and user_id = ${user_id}`
    );
    var bonus = 0;
    var remain_time = 0;
    if (rows.length > 0) {
      bonus = rows[0]["bonus"];
      remain_time = rows[0]["remain_time"];
    }
    return {
      bonus: bonus,
      remain_time: remain_time,
    };
  } catch (err) {
    console.log(err);
    return {
      bonus: 0,
      remain_time: 0,
    };
  }
};

const getUserReward = async (user_id) => {
  try {
    const rows = await query(`SELECT * from reward WHERE user_id = ${user_id}`);
    return rows;
  } catch (err) {
    return [];
  }
};

module.exports = {
  createReward,
  getRandomBonus,
  getUserReward,
};
