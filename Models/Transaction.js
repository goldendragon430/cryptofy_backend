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

const transactionList = async (key_str, start_date, end_date, type) => {
  try {
    const rows = await query(
      `select user.id, transactions.time, transactions.hash, transactions.amount, transactions.state ,user.wallet from transactions INNER JOIN user on transactions.user_id = user.id where (user.id like '%${key_str}%' or user.wallet like '%${key_str}%') and  transactions.time > DATE('${start_date}') and transactions.time < DATE('${end_date}') and transactions.type = '${type}'`
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
  transactionList,
};
