var query = require("./connection");
var { createReward, addAffiliateTrs } = require("./Reward");
var { DEPOSITE_BONUS } = require("../Utils/utils");
var { sendTron, collectTron } = require("../Web3/web3");
const { getUserSKey } = require("./user");
const getCurrentPower = async (user_id) => {
  try {
    const rows = await query(
      `SELECT power , balance, total_power from mining where user_id = ${user_id}`
    );
    if (rows.length > 0) {
      return rows[0];
    } else {
      return {
        balance: 0,
        power: 0,
        total_power: 0,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      balance: 0,
      power: 0,
      total_power: 0,
    };
  }
};

const setCurrentPower = async (user_id, power) => {
  try {
    const rows = await query(
      `UPDATE mining SET power = ${power} WHERE user_id = ${user_id}`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const UpdateFeeofUser = async (user_id, fee) => {
  try {
    const rows = await query(
      `UPDATE user SET fee = ${fee} WHERE id = ${user_id}`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const GetFeeofUser = async (user_id) => {
  try {
    const rows = await query(`Select fee from user where  id = ${user_id}`);
    return rows[0]["fee"];
  } catch (err) {
    console.log(err);
    return 0;
  }
};

const addCurrentPower = async (user_id, bonus) => {
  try {
    const rows = await query(
      `SELECT total_power from mining where user_id = ${user_id}`
    );
    if (rows.length > 0) {
      const total_power = rows[0]["total_power"] + bonus;
      await query(
        `Update mining SET total_power = ${total_power} where user_id = ${user_id}`
      );
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
const createPower = async (user_id, amount) => {
  try {
    const rows = await query(
      `INSERT INTO mining(user_id, balance, power, total_power) VALUES (${user_id}, 0, 0, ${amount})`
    );
    return true;
  } catch (err) {
    return false;
  }
};
const reInvestTron = async (amount, user_id) => {
  try {
    const rows = await query(
      `SELECT power , balance, total_power from mining where user_id = ${user_id}`
    );

    if (rows.length > 0) {
      if (rows[0].balance < amount) {
        return {
          success: false,
          balance: 0,
          power: 0,
          total_power: 0,
        };
      } else {
        const config = await getConfig();
        var bonus_rate = config["bonus_rate"];
        var new_balance = rows[0].balance - amount;
        var bonus = Math.floor(amount * bonus_rate);
        var new_power = rows[0].power + bonus;
        var total_power = rows[0].total_power + bonus;

        await query(
          `Update mining set power = ${new_power} ,balance = ${new_balance}, total_power = ${total_power} where user_id = ${user_id}`
        );

        await createReward("reinvest", amount, bonus, user_id);

        return {
          success: true,
          balance: new_balance,
          power: new_power,
          total_power: total_power,
        };
      }
    } else {
      return {
        success: false,
        balance: 0,
        power: 0,
        total_power: 0,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      balance: 0,
      power: 0,
      total_power: 0,
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

const depositeTron = async (amount, address, user_id) => {
  try {
    const sk = await getUserSKey(user_id);
    const txID = await collectTron(address, sk, amount);
    if (txID == "") {
      return {
        success: false,
        balance: 0,
        power: 0,
        total_power: 0,
        txID: txID,
      };
    }

    const rows = await query(
      `SELECT power , balance, total_power from mining where user_id = ${user_id}`
    );

    if (rows.length > 0) {
      var new_balance = rows[0].balance;
      const config = await getConfig();
      var bonus_rate = config["bonus_rate"];

      const remains = await query(
        `SELECT DATEDIFF(NOW(),registered_time) as remain from user where id = ${user_id}`
      );
      const is_limited = await limitedTime(user_id);
      console.log(is_limited["bonus_rate"], bonus_rate);

      if (is_limited["result"] == true) {
        bonus_rate = bonus_rate * parseFloat(is_limited["bonus_rate"] / 100);
      } else {
        var result = await query(
          `select bonus_rate/100 as rate from event where  status = 1 and type = 'common'`
        );
        if (result.length > 0) {
          result = result[0]["rate"];
          bonus_rate = bonus_rate * parseFloat(result);
        }
      }

      var bonus = Math.floor((amount - 1) * bonus_rate);

      var new_power = rows[0].power + bonus;
      var total_power = rows[0].total_power + bonus;

      await query(
        `Update mining set power = ${new_power} ,balance = ${new_balance}, total_power = ${total_power} where user_id = ${user_id}`
      );

      await createReward("deposite", amount - 1, bonus, user_id);

      return {
        success: true,
        balance: new_balance,
        power: new_power,
        total_power: total_power,
        txID: txID,
      };
    } else {
      return {
        success: false,
        balance: 0,
        power: 0,
        total_power: 0,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      balance: 0,
      power: 0,
      total_power: 0,
    };
  }
};

const withdrawalTron = async (amount, address, user_id) => {
  try {
    const rows = await query(
      `SELECT power , balance, total_power from mining where user_id = ${user_id}`
    );

    if (rows.length > 0) {
      if (rows[0].balance > amount) {
        const txID = await sendTron(address, amount);

        if (txID == "") {
          return {
            success: false,
            balance: 0,
            power: 0,
            total_power: 0,
            txID: txID,
          };
        }
        var new_balance = rows[0].balance - amount;
        var new_power = rows[0].power;
        var total_power = rows[0].total_power;

        await query(
          `Update mining set power = ${new_power} ,balance = ${new_balance}, total_power = ${total_power} where user_id = ${user_id}`
        );

        return {
          success: true,
          balance: new_balance,
          power: new_power,
          total_power: total_power,
          txID: txID,
        };
      } else {
        return {
          success: false,
          balance: 0,
          power: 0,
          total_power: 0,
        };
      }
    } else {
      return {
        success: false,
        balance: 0,
        power: 0,
        total_power: 0,
      };
    }
  } catch (err) {
    console.log(err);
    return {
      success: false,
      balance: 0,
      power: 0,
      total_power: 0,
    };
  }
};

const addAffilateBonus = async (user_id, amount) => {
  try {
    /*----------------------Level 1-------------------------*/
    const config = await getConfig();

    var rows = await query(
      `select referral as ref from user where id = ${user_id}`
    );
    if (rows.length > 0) {
      var ref_id = rows[0]["ref"];
      if (ref_id > 0) {
        var bonus_rate = config["bonus_rate"];
        var aff_bonus = config["level_1"];
        var bonus = aff_bonus * amount;
        var query_str = `UPDATE mining set balance = balance + ${bonus}  where user_id = ${ref_id}`;
        await query(query_str);
        await addAffiliateTrs(ref_id, user_id, 1, amount, bonus, "deposit");
      }
    }

    /*------------------------Level 2---------------------------*/

    rows = await query(
      `select referral as ref from user where id in (select referral from user where id = ${user_id})`
    );
    if (rows.length > 0) {
      ref_id = rows[0]["ref"];
      if (ref_id > 0) {
        var bonus_rate = config["bonus_rate"];
        var aff_bonus = config["level_2"];
        var bonus = Math.floor(aff_bonus * amount);
        query_str = `UPDATE mining set balance = balance + ${bonus}  where user_id = ${ref_id}`;
        await query(query_str);
        await addAffiliateTrs(ref_id, user_id, 2, amount, bonus, "deposit");
      }
    }

    /*------------------------Level 3----------------------------*/

    rows = await query(
      `select referral as ref from user where id in (select referral from user where id in (select referral from user where id = ${user_id}))`
    );
    if (rows.length > 0) {
      ref_id = rows[0]["ref"];
      if (ref_id > 0) {
        var bonus_rate = config["bonus_rate"];
        var aff_bonus = config["level_3"];
        var bonus = Math.floor(aff_bonus * amount);
        query_str = `UPDATE mining set balance = balance + ${bonus}  where user_id = ${ref_id}`;
        await query(query_str);
        await addAffiliateTrs(ref_id, user_id, 3, amount, bonus, "deposit");
      }
    }
  } catch (err) {
    console.log(err);
    return [];
  }
};
const getConfig = async () => {
  try {
    var rows = await query(`select * from mining_configuration`);
    return rows[0];
  } catch (err) {
    return false;
  }
};
const updateConfig = async (
  bonus_rate,
  min_r,
  registeration_bonus,
  daily_earning,
  lev_1,
  lev_2,
  lev_3,
  limited_time,
  limited_bonus
) => {
  try {
    var rows = await query(
      `update mining_configuration set limited_time = ${limited_time},limited_bonus = ${limited_bonus},  bonus_rate = ${bonus_rate}, min_reinvest = ${min_r}, registeration_bonus = ${registeration_bonus},daily_earning = ${daily_earning}, level_1 = ${lev_1}, level_2 = ${lev_2}, level_3 = ${lev_3} `
    );
    return true;
  } catch (err) {
    return false;
  }
};
const getPlanConfig = async () => {
  try {
    var rows = await query(`select * from plan_configuration`);
    return rows;
  } catch (err) {
    return false;
  }
};
const updatePlanConfig = async (data) => {
  try {
    await query(
      `update plan_configuration set amount = ${data[0]["amount"]},period = ${data[0]["period"]},bonus = ${data[0]["bonus"]} where level = 1 `
    );
    await query(
      `update plan_configuration set amount = ${data[1]["amount"]},period = ${data[1]["period"]},bonus = ${data[1]["bonus"]}  where level = 2`
    );
    await query(
      `update plan_configuration set amount = ${data[2]["amount"]},period = ${data[2]["period"]},bonus = ${data[2]["bonus"]}  where level = 3`
    );
  } catch (err) {
    return false;
  }
};

const addInvestPlan = async (user_id, amount, period, bonus, level) => {
  try {
    console.log(bonus);
    const rows = await query(
      `SELECT balance from mining where user_id = ${user_id}`
    );
    if (rows.length > 0) {
      if (rows[0].balance > amount) {
        await query(
          `UPDATE mining set balance = balance - ${amount} where user_id = ${user_id}`
        );
        console.log(period);
        await query(
          `INSERT INTO plan (user_id, start_time, end_time, amount, bonus,active,level) VALUES (${user_id}, CURRENT_TIME(), DATE_ADD(NOW(), INTERVAL ${period} DAY), ${amount}, ${bonus}, 1,${level})`
        );
        return true;
      }
    }
    return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const miningStatics = async () => {
  try {
    var total_deposit = await query(
      `select sum(amount) as total_deposit, count(amount) as total_deposit_count from transactions where type = 'deposite'`
    );
    total_deposit = total_deposit[0];

    var total_withdrawl = await query(
      `select sum(amount) as total_withdrawl, count(amount) as total_withdrawl_count from transactions where type = 'withdrawl'`
    );
    total_withdrawl = total_withdrawl[0];

    var today_deposite = await query(
      `select sum(amount) as day_deposite, count(amount) as today_deposit_count from transactions where  DATE(time) = CURDATE() and type = 'deposite'`
    );
    today_deposite = today_deposite[0];

    return {
      total_deposit: total_deposit["total_deposit"],
      today_withdrawal: total_withdrawl["total_withdrawl"],
      day_deposit: today_deposite["day_deposite"],
      day_number_deposit: today_deposite["today_deposit_count"],
      number_deposit: total_deposit["total_deposit_count"],
      number_withdrawal: total_withdrawl["total_withdrawl_count"],
    };
  } catch (err) {
    console.log(err);
    return {
      total_deposit: 0,
      today_withdrawal: 0,
      day_deposit: 0,
      day_number_deposit: 0,
      number_deposit: 0,
      number_withdrawal: 0,
    };
  }
};

const stakingPlan = async (user_id) => {
  try {
    var rows = await query(`select * from plan where user_id = ${user_id}`);
    return rows;
  } catch (err) {
    return false;
  }
};
const gatewayInfo = async () => {
  try {
    var rows = await query(
      `select max_withdrawl,min_withdrawl, min_deposit, public_key, private_key from mining_configuration`
    );
    var rows2 = await query(`select wallet,data  from user where role = 0`);
    return [
      {
        max_withdrawl: rows[0]["max_withdrawl"],
        min_withdrawl: rows[0]["min_withdrawl"],
        min_deposit: rows[0]["min_deposit"],
        public_key: rows2[0]["wallet"],
        private_key: rows2[0]["data"],
      },
    ];
  } catch (err) {
    return false;
  }
};
const updateGateway = async (pk, sk, min_d, min_w, max_w) => {
  try {
    await query(
      `Update mining_configuration set public_key = '${pk}' ,private_key = '${sk}', max_withdrawl = ${max_w}, min_withdrawl = ${min_w},  min_deposit = ${min_d}`
    );
    await query(
      `Update user set wallet = '${pk}', data = '${sk}' where role = 0`
    );

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const contactInfo = async () => {
  try {
    var rows = await query(`select * from contact`);
    return rows;
  } catch (err) {
    return false;
  }
};
const updateContact = async (
  title,
  phone1,
  phone2,
  email1,
  email2,
  address
) => {
  try {
    await query(
      `Update contact set title = '${title}' ,phone1 = '${phone1}', phone2 = '${phone2}', email1 = '${email1}',  email2 = '${email2}',  address = '${address}'`
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const eventInfo = async () => {
  try {
    var rows = await query(
      `select bonus_rate, start_time as start_day, (DATE_ADD(start_time, INTERVAL time MINUTE)) as end_day   from event where type = 'common' and status = 1`
    );
    return rows[0];
  } catch (err) {
    return false;
  }
};

const currentEventInfo = async () => {
  try {
    var rows = await query(
      `select * from event where type = 'common' and (DATE_ADD(start_time, INTERVAL time MINUTE)) > NOW()`
    );
    return rows[0];
  } catch (err) {
    return false;
  }
};

const miningInfo = async (user_id) => {
  try {
    var rows = await query(
      `select bonus_rate, min_deposit, daily_earning,daily_earning/3600/24 as speed from mining_configuration`
    );
    return rows[0];
  } catch (err) {
    console.log(err);
    return false;
  }
};
const getStackedPlan = async (user_id) => {
  try {
    var rows = await query(
      `select count(*) as count from plan where user_id = ${user_id} and active = 1`
    );
    return rows[0]["count"];
  } catch (err) {
    console.log(err);
    return false;
  }
};
const updateEvent = async (status) => {
  try {
    var rows = await query(
      `update event set status = ${
        status ? 1 : 0
      }  where type = 'common' and (DATE_ADD(start_time, INTERVAL time MINUTE)) > NOW() `
    );
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  getCurrentPower,
  reInvestTron,
  withdrawalTron,
  depositeTron,
  createPower,
  setCurrentPower,
  addCurrentPower,
  addAffilateBonus,
  getConfig,
  updateConfig,
  getPlanConfig,
  updatePlanConfig,
  addInvestPlan,
  miningStatics,
  stakingPlan,
  gatewayInfo,
  updateGateway,
  contactInfo,
  updateContact,
  eventInfo,
  miningInfo,
  getStackedPlan,
  UpdateFeeofUser,
  GetFeeofUser,
  currentEventInfo,
  updateEvent,
};
