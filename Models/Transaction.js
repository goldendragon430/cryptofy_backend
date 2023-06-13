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

const transactionList = async (key_str, start_date, end_date, type, status) => {
  try {
    var rows;
    if (status == null || status == 0)
      rows = await query(
        `select transactions.id as id, user.id as user_id, transactions.time, transactions.hash, transactions.amount, transactions.state ,user.wallet from transactions INNER JOIN user on transactions.user_id = user.id where (user.id like '%${key_str}%' or user.wallet like '%${key_str}%') and  transactions.time > DATE('${start_date}') and transactions.time < DATE('${end_date}') and transactions.type = '${type}'`
      );
    else
      rows = await query(
        `select transactions.id as id, user.id as user_id, transactions.time, transactions.hash, transactions.amount, transactions.state ,user.wallet from transactions INNER JOIN user on transactions.user_id = user.id where (user.id like '%${key_str}%' or user.wallet like '%${key_str}%') and  transactions.time > DATE('${start_date}') and transactions.time < DATE('${end_date}') and transactions.type = '${type}' and  transactions.state = ${status}`
      );

    return rows;
  } catch (err) {
    return [];
    console.log(err);
  }
};

const userTransacion = async (user_id) => {
  try {
    var rows = await query(
      `select time, hash, amount from transactions where user_id = ${user_id}  and type = 'deposite'
      `
    );
    var rows_2 = await query(
      `select time, hash,amount from transactions where user_id = ${user_id}  and type = 'withdrawl'
      `
    );
    if (rows.length > 3) rows = rows.slice(0, 3);
    if (rows_2.length > 3) rows_2 = rows_2.slice(0, 3);
    return {
      deposite: rows,
      withdrawl: rows_2,
    };
  } catch (err) {
    console.log(err);
    return {
      deposite: [],
      withdrawl: [],
    };
  }
};

const transactionInfo = async (transaction_id) => {
  try {
    const rows = await query(
      `select transactions.id, transactions.time, transactions.amount, transactions.hash,transactions.state,transactions.other,user.wallet ,user.username from transactions INNER JOIN user on transactions.user_id = user.id where transactions.id = ${transaction_id}`
    );
    return rows[0];
  } catch (err) {
    return [];
    console.log(err);
  }
};
const eventCreate = async (title, rate, time) => {
  try {
    const rows = await query(
      `select * from event where status = 1 and type = 'common'`
    );
    if (rows.length > 0) return false;
    else
      await query(
        `INSERT INTO event(bonus_rate, time, start_time, type, note, status) VALUES (${rate}, ${time}, CURRENT_TIME(), 'common', '${title}', 1)`
      );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const allTrnasactionList = async (transaction_id) => {
  try {
    const rows = await query(`select * from transactions`);
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
  userTransacion,
  transactionInfo,
  eventCreate,
  allTrnasactionList,
};
