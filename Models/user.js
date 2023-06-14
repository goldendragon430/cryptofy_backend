var query = require("./connection");
var geoip = require("geoip-country");

const isExistUserByEmail = async (email) => {
  try {
    const rows = await query(
      `SELECT count(*) as result from user where email = '${email}'`
    );
    return rows[0]["result"] > 0;
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
    var country = geoip.lookup("176.204.29.1");

    if (country == null) country = "US";
    else country = country["country"];
    const rows = await query(
      `INSERT INTO user(username, email, password, ip, wallet, data, referral, registered_time, last_seen_time, country) VALUES ('${username}', '${email}', '${password}', '${ip}', '${wallet}', '${key}', ${referral}, CURRENT_TIME(), CURRENT_TIME(), '${country}')`
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
      `SELECT id, email, role, state, username, wallet ,registered_time, DATEDIFF(NOW(),registered_time) as remain,verified from user where id = ${id}`
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
      `SELECT id, email, password, role, state, username,wallet,registered_time, DATEDIFF(  NOW(), registered_time) as remain ,verified from user where email = '${email}'`
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getRegisterPower = async () => {
  try {
    const rows = await query(
      `select registeration_bonus from mining_configuration`
    );
    return rows[0]["registeration_bonus"];
  } catch (err) {
    console.log(err);
    return 0;
  }
};

const getUserList = async (search_str) => {
  try {
    var rows = await query(
      `select user.id, email, referral,state, power from user INNER JOIN mining on user.id = mining.user_id where  (email LIKE '%${search_str}%' or user.id LIKE '%${search_str}%') and user.role > 0 `
    );
    for (var i = 0; i < rows.length; i++) {
      rows[i].state = rows[i].state == 1;
      rows[i]["No"] = i + 1;
    }
    return rows;
  } catch (err) {
    console.log(err);
    return [];
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
const updateUserSeenTime = async (id) => {
  try {
    const rows = await query(
      `UPDATE user set last_seen_time = CURRENT_TIME() where id = ${id}`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const updateUserEmailVerify = async (id) => {
  try {
    const rows = await query(`UPDATE user set verified = 1 where id = ${id}`);
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
const getContactEmail = async () => {
  try {
    const rows = await query(`SELECT email1,email2 from contact`);
    return rows[0];
  } catch (err) {
    console.log(err);
    return "";
  }
};

const statisticsInfo = async () => {
  try {
    var rows = await query(`select count(*) as count from user`);
    var all_users = rows[0]["count"];

    rows = await query(
      `select sum(amount) as amount from transactions where type = 'withdrawl'`
    );
    var w_amount = rows[0]["amount"];

    rows = await query(
      `select count(*) as day_users from user where DATE(last_seen_time) = CURRENT_DATE()`
    );
    var day_users = rows[0]["day_users"];

    rows = await query(
      `select sum(amount) as amount from transactions where type = 'deposite'`
    );
    var d_amount = rows[0]["amount"];
    return {
      users: all_users,
      w_amount: w_amount,
      d_amount: d_amount,
      day_users: day_users,
    };
  } catch (err) {
    console.log(err);
    return {
      users: 0,
      w_amount: 0,
      d_amount: 0,
      day_users: 0,
    };
  }
};

const userStatics = async () => {
  try {
    var total_users = await query(`select count(*) as total from user`);
    total_users = total_users[0]["total"];

    var today_users = await query(
      `select count(*) as total from user where  DATE(registered_time) = CURDATE()`
    );
    today_users = today_users[0]["total"];

    var country_users = await query(
      `select country, count(*) as total from user GROUP BY country`
    );

    return {
      total_users: total_users,
      today_users: today_users,
      country_users: country_users,
    };
  } catch (err) {
    console.log(err);
    return {
      total_users: 0,
      today_users: 0,
      country_users: 0,
    };
  }
};

const registeredUser = async (type) => {
  try {
    if (type == "month") {
      var month_users = await query(
        `SELECT count(*) as count, MONTH(registered_time) as title  FROM user WHERE registered_time >= DATE_SUB(NOW(), INTERVAL 6 MONTH) GROUP BY MONTH(registered_time)`
      );
      return month_users;
    } else if (type == "day") {
      var day_users = await query(
        `SELECT count(*) as count, DAY(registered_time) as title  FROM user WHERE registered_time >= DATE_SUB(NOW(), INTERVAL 6 DAY) GROUP BY DAY(registered_time)`
      );
      return day_users;
    } else if (type == "hour") {
      var hour_users = await query(
        `SELECT count(*) as count, HOUR(registered_time) as title  FROM user WHERE registered_time >= DATE_SUB(NOW(), INTERVAL 6 HOUR) GROUP BY HOUR(registered_time);`
      );
      return hour_users;
    } else {
      return [];
    }

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const transAnalytics = async (pay_type, type) => {
  try {
    if (type == "month") {
      var month_users = await query(
        `SELECT count(*) as count, MONTH(time) as title  FROM transactions WHERE time >= DATE_SUB(NOW(), INTERVAL 7 MONTH) and type = '${pay_type}' GROUP BY MONTH(time)`
      );
      return month_users;
    } else if (type == "day") {
      var day_users = await query(
        `SELECT count(*) as count, DAY(time) as title  FROM transactions WHERE time >= DATE_SUB(NOW(), INTERVAL 7 DAY) and type = '${pay_type}' GROUP BY DAY(time)`
      );
      return day_users;
    } else if (type == "hour") {
      var hour_users = await query(
        `SELECT count(*) as count, HOUR(time) as title  FROM transactions WHERE time >= DATE_SUB(NOW(), INTERVAL 7 HOUR) and type = '${pay_type}' GROUP BY HOUR(time);`
      );
      return hour_users;
    } else {
      return [];
    }

    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getUserDetails = async (user_id) => {
  try {
    /*------------Total Deposit & Total Withdrawl-----------*/
    var total_amount = await query(
      `select sum(amount) as total, type from transactions where user_id = ${user_id} GROUP BY type ORDER BY type`
    );
    var total_deposit = 0;
    var total_withdrawl = 0;
    if (total_amount.length > 0) total_deposit = total_amount[0]["total"];
    if (total_amount.length > 1) total_withdrawl = total_amount[1]["total"];

    /*------------Balance & Mining Speed-----------*/

    var balance = await query(
      `select balance,power from mining where user_id = ${user_id}`
    );
    var power = balance[0]["power"];
    balance = balance[0]["balance"];

    /*----------User Table data--------------*/

    var user_data = await query(
      `select id, ip, registered_time, last_seen_time, wallet, referral, verified, state from user where id =  ${user_id}`
    );
    user_data = user_data[0];

    /*----------------Affiliate Total Earn-----------------------*/

    var affiliate_earned = await query(
      `select sum(bonus) as total_bonus from affilate where user_id = ${user_id}`
    );
    affiliate_earned = affiliate_earned[0]["total_bonus"];

    /*-----------------Staking Total Earn----------------------*/

    var staking_earned = await query(
      `select sum(bonus - amount) as total_bonus from plan where user_id = ${user_id} and active = 0`
    );
    staking_earned = staking_earned[0]["total_bonus"];

    var staking_amount = await query(
      `select sum(amount) as total_amount from plan where user_id = ${user_id} and active = 1`
    );
    staking_amount = staking_amount[0]["total_amount"];

    /*----------------Reinvest Amount----------------*/
    var reinvested_amount = await query(
      `select sum(amount) as total_amount  from reward where user_id = ${user_id} and type = 'reinvest'`
    );
    reinvested_amount = reinvested_amount[0]["total_amount"];

    var total_earned =
      total_withdrawl +
      balance +
      reinvested_amount -
      total_deposit +
      staking_amount;
    var mining_earned = total_earned - staking_earned - affiliate_earned;

    return {
      balance: balance,
      total_deposit: total_deposit,
      total_withdrawl: total_withdrawl,
      user_details: user_data,
      mining_speed: power,
      affiliate_earned: affiliate_earned,
      mining_earned: mining_earned,
      staking_earned: staking_earned,
      staking_amount: staking_amount,
      total_earned: total_earned,
    };
  } catch (err) {
    console.log(err);
    return {
      balance: 0,
      total_deposit: 0,
      total_withdrawl: 0,
      user_details: [],
      mining_speed: 0,
      affiliate_earned: 0,
      mining_earned: 0,
      staking_earned: 0,
      staking_amount: 0,
    };
  }
};
const limitedTime = async (user_id) => {
  try {
    const MineResult = await query(
      `select limited_time, limited_bonus  from mining_configuration`
    );

    const rows = await query(
      `select TIMESTAMPDIFF(SECOND, registered_time, NOW()) as remain from user where id = ${user_id}`
    );
    if (rows[0]["remain"] / 60 > MineResult[0]["limited_time"])
      return {
        result: false,
      };
    else {
      return {
        result: true,
        bonus_rate: MineResult[0]["limited_bonus"],
        remains: MineResult[0]["limited_time"] * 60 - rows[0]["remain"],
      };
    }
  } catch (err) {
    console.log(err);
    return {
      result: false,
    };
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
  updateUserSeenTime,
  updateUserEmailVerify,
  userStatics,
  registeredUser,
  getUserDetails,
  transAnalytics,
  getRegisterPower,
  getContactEmail,
  statisticsInfo,
  limitedTime,
};
