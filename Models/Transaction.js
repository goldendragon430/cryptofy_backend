var query = require("./connection");

const addTransaction = async (type, amount, hash, user_id) => {
  try {
    const rows = await query(
      `INSERT INTO transactions (user_id, time, type, amount, hash) VALUES (${user_id}, CURRENT_TIME(), '${type}', ${amount}, '${hash}')`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getTransactionList = async (type, uid) => {
  try {
    const rows = await query(
      `select * from transactions  where type = '${type}' and user_id = ${uid}`
    );
    return rows;
  } catch (err) {
    return [];
    console.log(err);
  }
};

module.exports = {
  addTransaction,
  getTransactionList,
};
