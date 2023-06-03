var query = require("./connection");
var { createReward, addAffiliateTrs } = require("./Reward");
var { BONUS_RATE, DEPOSITE_BONUS, AFF_BONUS } = require("../Utils/utils");
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
        var new_balance = rows[0].balance - amount;
        var bonus = Math.floor(amount * BONUS_RATE);
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
      var bonus = Math.ceil(amount * (BONUS_RATE + DEPOSITE_BONUS));
      var new_power = rows[0].power + bonus;
      var total_power = rows[0].total_power + bonus;

      await query(
        `Update mining set power = ${new_power} ,balance = ${new_balance}, total_power = ${total_power} where user_id = ${user_id}`
      );

      await createReward("deposite", amount, bonus, user_id);

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

    var rows = await query(
      `select referral as ref from user where id = ${user_id}`
    );
    if (rows.length > 0) {
      var ref_id = rows[0]["ref"];
      if (ref_id > 0) {
        var bonus = Math.floor(AFF_BONUS[0] * amount * BONUS_RATE);
        var query_str = `UPDATE mining set total_power = total_power + ${bonus}  where user_id = ${ref_id}`;
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
        bonus = Math.floor(AFF_BONUS[1] * amount * BONUS_RATE);
        query_str = `UPDATE mining set total_power = total_power + ${bonus}  where user_id = ${ref_id}`;
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
        bonus = Math.floor(AFF_BONUS[2] * amount * BONUS_RATE);
        query_str = `UPDATE mining set total_power = total_power + ${bonus}  where user_id = ${ref_id}`;
        await query(query_str);
        await addAffiliateTrs(ref_id, user_id, 3, amount, bonus, "deposit");
      }
    }
  } catch (err) {
    console.log(err);
    return [];
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
};
