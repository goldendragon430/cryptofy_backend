var query = require("./connection");

const isExistUserByEmail = async (email) => {
  try {
    const rows = await query(
      `SELECT count(*) as result from user where email = '${email}'`
    );
    return rows[0]["result"] == 1;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const isExistUserById = async (id) => {
  try {
    const rows = await query(
      `SELECT count(*) as result from user where id =  ${id}`
    );
    return rows[0]["result"] == 1;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const isExistUserByIP = async (ip) => {
  try {
    const rows = await query(
      `SELECT count(*) as result from user where ip = '${ip}'`
    );
    return rows[0]["result"] == 1;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addUser = async (
  username,
  email,
  password,
  ip,
  wallet,
  key,
  referral
) => {
  try {
    const rows = await query(
      `INSERT INTO user(username, email, password, ip, wallet, data, referral) VALUES ('${username}', '${email}', '${password}', '${ip}', '${wallet}', '${key}', ${referral})`
    );
    const result = await query(`SELECT LAST_INSERT_ID()  as result`);
    return result[0]["result"];
  } catch (err) {
    console.log(err);
    return 0;
  }
};
const getUserData = async (id) => {
  try {
    const rows = await query(
      `SELECT id, email, role, state, username, wallet from user where id = ${id}`
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUserSKey = async (id) => {
  try {
    const rows = await query(`SELECT data from user where id = ${id}`);
    return rows[0]["data"];
  } catch (err) {
    console.log(err);
    return "";
  }
};

const getUserDataByEmail = async (email) => {
  try {
    const rows = await query(
      `SELECT id, email, password, role, state, username,wallet from user where email = '${email}'`
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUserList = async () => {
  try {
    const rows = await query(`SELECT * from user where role > 0`);
    return rows;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const suspendUser = async (id, state) => {
  try {
    const rows = await query(
      `UPDATE user set state = ${state} where id = ${id}`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getUserAddress = async (id) => {
  try {
    const rows = await query(
      `SELECT wallet as result from user where id =  ${id}`
    );
    return rows[0]["result"];
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getAdminKey = async () => {
  try {
    const rows = await query(`SELECT data ,wallet from user where role = 0`);
    return rows[0];
  } catch (err) {
    console.log(err);
    return "";
  }
};

module.exports = {
  isExistUserByEmail,
  isExistUserByIP,
  isExistUserById,
  addUser,
  getUserData,
  getUserDataByEmail,
  getUserList,
  suspendUser,
  getUserAddress,
  getAdminKey,
  getUserSKey,
};
