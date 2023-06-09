const bcrypt = require("bcrypt");

var {
  getUserList,
  suspendUser,
  userStatics,
  registeredUser,
  getUserDetails,
} = require("../Models/user.js");

var { miningStatics, stakingPlan } = require("../Models/mining.js");
var { transactionList } = require("../Models/Transaction.js");
const getUsersData = async (req, res) => {
  try {
    const { search_str } = req.body;
    const userinfo = await getUserList(search_str);
    res.status(200).json({
      result: "success",
      data: userinfo,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const setUserState = async (req, res) => {
  try {
    const { user, state } = req.body;
    const result = await suspendUser(user, state);
    if (result == true) {
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
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const userAnalytics = async (req, res) => {
  try {
    const result = await userStatics();

    res.status(200).json({
      result: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const userRegisters = async (req, res) => {
  try {
    const { type } = req.body;
    const result = await registeredUser(type);

    res.status(200).json({
      result: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const miningAnalytics = async (req, res) => {
  try {
    const result = await miningStatics();

    res.status(200).json({
      result: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const userDetails = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await getUserDetails(user_id);

    res.status(200).json({
      result: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const getStakingPlan = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await stakingPlan(user_id);

    res.status(200).json({
      result: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const getTransaction = async (req, res) => {
  try {
    const { key_str, start_date, end_date, type } = req.body;
    const result = await transactionList(key_str, start_date, end_date, type);

    res.status(200).json({
      result: "success",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

module.exports = {
  getUsersData,
  setUserState,
  userAnalytics,
  userRegisters,
  registeredUser,
  miningAnalytics,
  userDetails,
  getStakingPlan,
  getTransaction,
};
