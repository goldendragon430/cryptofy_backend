const bcrypt = require("bcrypt");

var {
  getCurrentPower,
  setCurrentPower,
  reInvestTron,
  withdrawalTron,
  depositeTron,
  addAffilateBonus,
  getConfig,
  updateConfig,
  getPlanConfig,
  updatePlanConfig,
  addInvestPlan,
} = require("../Models/Mining");
var { getRandomBonus } = require("../Models/Reward");
const { getUserData } = require("../Models/user");
const { addTransaction } = require("../Models/Transaction");
const { getBalance } = require("../Web3/web3");
const getPower = async (req, res) => {
  try {
    const user_id = req.user;
    console.log(user_id);
    var minings = await getCurrentPower(user_id);
    var rewards = await getRandomBonus(user_id);
    var power = parseInt(minings.power);
    var balance = minings.balance;
    var total_power = parseInt(minings.total_power);
    var remains = rewards.remain_time;
    res.status(200).json({
      result: "success",
      power: power,
      total_power: total_power,
      balance: balance,
      bonus_expired_time: remains,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const setPower = async (req, res) => {
  try {
    var { power } = req.body;
    const user_id = req.user;
    await setCurrentPower(user_id, power);
    var minings = await getCurrentPower(user_id);
    var rewards = await getRandomBonus(user_id);
    power = parseInt(minings.power);
    var balance = minings.balance;
    var total_power = parseInt(minings.total_power);
    var remains = rewards.remain_time;
    res.status(200).json({
      result: "success",
      power: power,
      total_power: total_power,
      balance: balance,
      bonus_expired_time: remains,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const reinvest = async (req, res) => {
  const { amount } = req.body;
  const user_id = req.user;
  try {
    const minings = await reInvestTron(amount, user_id);
    var rewards = await getRandomBonus(user_id);
    if (minings.success) {
      var power = minings.power;
      var total_power = minings.total_power;
      var balance = minings.balance;
      var remains = rewards.remain_time;
      res.status(200).json({
        result: "success",
        power: power,
        total_power: total_power,
        balance: balance,
        bonus_expired_time: remains,
      });
    } else {
      res.status(400).json({
        result: "failed",
        msg: "Your balance is low",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const withdrawl = async (req, res) => {
  const { amount, address } = req.body;

  try {
    const user_id = req.user;
    const user_info = await withdrawalTron(amount, address, user_id);
    if (user_info.success) {
      await addTransaction("withdrawl", amount, user_info.txID, user_id);
      var rewards = await getRandomBonus(user_id);
      user_info["bonus_expired_time"] = rewards.remain_time;
      user_info["result"] = "success";
      res.status(200).json(user_info);
    } else {
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const checkDeposite = async (req, res) => {
  try {
    const user_id = req.user;
    const userinfo = await getUserData(user_id);
    const result = await getBalance(userinfo.wallet);
    console.log("balance ", result);
    if (result <= 2) {
      res.status(200).json({
        result: "success",
        is_deposited: false,
      });
    } else {
      const user_info = await depositeTron(
        result - 1,
        userinfo.wallet,
        user_id
      );
      if (user_info.success) {
        /*------------GET BONUS-------------*/
        await addTransaction("deposite", result - 1, user_info.txID, user_id);
        var rewards = await getRandomBonus(user_id);

        /*------------Add Affiliate-------------*/
        await addAffilateBonus(user_id, result - 1);

        user_info["bonus_expired_time"] = rewards.remain_time;
        user_info["result"] = "success";
        user_info["is_deposited"] = true;
        user_info["amount"] = result - 1;
        res.status(200).json(user_info);
      } else {
        res.status(400).json({
          result: "failed",
          msg: "Server Error",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const getConfiguration = async (req, res) => {
  try {
    const result = await getConfig();
    if (result == false) {
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
    } else {
      res.status(200).json({
        result: "success",
        data: result,
      });
    }
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const updateConfiguration = async (req, res) => {
  try {
    const { bonus_rate, min_r, min_w, lev_1, lev_2, lev_3 } = req.body;
    const result = await updateConfig(
      bonus_rate,
      min_r,
      min_w,
      lev_1,
      lev_2,
      lev_3
    );
    if (result == false) {
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
    } else {
      res.status(200).json({
        result: "success",
      });
    }
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const test = async (req, res) => {
  try {
    await addAffilateBonus(9, 100);

    res.status(200).json({
      result: "success",
      msg: "Server Error",
    });
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const updatePlanConfiguration = async (req, res) => {
  try {
    const { data } = req.body;
    const result = await updatePlanConfig(data);
    if (result == false) {
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
    } else {
      res.status(200).json({
        result: "success",
      });
    }
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const getPlanConfiguration = async (req, res) => {
  try {
    const result = await getPlanConfig();
    if (result == false) {
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
    } else {
      res.status(200).json({
        result: "success",
        data: result,
      });
    }
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const investPlan = async (req, res) => {
  try {
    const user_id = req.user;
    const { amount, bonus, period } = req.body;
    console.log(bonus);
    const result = addInvestPlan(user_id, amount, period, bonus);
    if (result) {
      res.status(200).json({
        result: "success",
      });
    } else {
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
    }
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
module.exports = {
  getPower,
  setPower,
  reinvest,
  withdrawl,
  checkDeposite,
  getConfiguration,
  updateConfiguration,
  getPlanConfiguration,
  updatePlanConfiguration,
  investPlan,
  test,
};
