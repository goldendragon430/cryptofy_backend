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
    var remain_time = -1;
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
      remain_time: -1,
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

const getAffiliateInfo = async (user_id) => {
  try {
    const rows = await query(
      `SELECT level, count(*) as count, sum(amount) as total from affilate WHERE user_id = ${user_id} and type = 'deposit' GROUP BY level ORDER BY level`
    );
    return rows;
  } catch (err) {
    return [];
  }
};

const getAffiliateTrs = async (user_id) => {
  try {
    const rows = await query(
      `SELECT affilate.time,affilate.amount,affilate.bonus,user.username as name FROM affilate INNER JOIN user ON  affilate.ref_id = user.id where affilate.user_id= ${user_id} AND affilate.type = 'deposit' AND affilate.level = 1`
    );
    const rows_2 = await query(
      `SELECT affilate.time,affilate.amount,affilate.bonus,user.username as name FROM affilate INNER JOIN user ON affilate.ref_id = user.id where affilate.user_id=  ${user_id} AND affilate.type = 'deposit' AND affilate.level = 2`
    );
    const rows_3 = await query(
      `SELECT affilate.time,affilate.amount,affilate.bonus,user.username as name FROM affilate INNER JOIN user ON affilate.ref_id = user.id where affilate.user_id=  ${user_id} AND affilate.type = 'deposit' AND affilate.level = 3`
    );
    return [rows, rows_2, rows_3];
  } catch (err) {
    return [[], [], []];
  }
};

const addAffiliateTrs = async (user_id, ref_id, level, amount, bonus, type) => {
  try {
    var rows = await query(
      `INSERT INTO affilate(user_id, ref_id, time, level, amount, bonus, type) VALUES (${user_id}, ${ref_id}, CURRENT_TIME(), ${level}, ${amount}, ${bonus}, '${type}')`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
module.exports = {
  createReward,
  getRandomBonus,
  getUserReward,
  getAffiliateInfo,
  getAffiliateTrs,
  addAffiliateTrs,
};
