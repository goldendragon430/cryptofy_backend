const bcrypt = require("bcrypt");

var {
  getUserList,
  suspendUser,
  userStatics,
  registeredUser,
  transAnalytics,
  getUserDetails,
  statisticsInfo,
} = require("../Models/user.js");

var {
  miningStatics,
  stakingPlan,
  gatewayInfo,
  updateGateway,
  contactInfo,
  updateContact,
} = require("../Models/Mining.js");
var { getAffiliateTrs } = require("../Models/Reward");
var {
  transactionList,
  userTransacion,
  transactionInfo,
  eventCreate,
} = require("../Models/Transaction.js");
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
    const date = new Date();
    res.status(200).json({
      result: "success",
      data: result,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: date.getHours(),
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
    const { key_str, start_date, end_date, type, status } = req.body;
    const result = await transactionList(
      key_str,
      start_date,
      end_date,
      type,
      status
    );

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
const getGateway = async (req, res) => {
  try {
    const result = await gatewayInfo();
    if (result)
      res.status(200).json({
        result: "success",
        data: result,
      });
    else {
      res.status(200).json({
        result: "failed",
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

const setGateway = async (req, res) => {
  try {
    const { pk, sk, min_d, min_w, max_w } = req.body;
    const result = await updateGateway(pk, sk, min_d, min_w, max_w);
    if (result == true)
      res.status(200).json({
        result: "success",
      });
    else
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const getContact = async (req, res) => {
  try {
    const result = await contactInfo();
    if (result)
      res.status(200).json({
        result: "success",
        data: result,
      });
    else {
      res.status(200).json({
        result: "failed",
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

const setContact = async (req, res) => {
  try {
    const { title, phone1, phone2, email1, email2, address } = req.body;
    const result = await updateContact(
      title,
      phone1,
      phone2,
      email1,
      email2,
      address
    );
    if (result == true)
      res.status(200).json({
        result: "success",
      });
    else
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const transactionAnalytics = async (req, res) => {
  try {
    const { type, pay_type } = req.body;
    const result = await transAnalytics(pay_type, type);
    const date = new Date();
    res.status(200).json({
      result: "success",
      data: result,
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      hour: date.getHours(),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const getUserTransaction = async (req, res) => {
  try {
    const { user_id } = req.body;
    const result = await userTransacion(user_id);

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
const getUserAffiliates = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await getAffiliateTrs(user_id);

    res.status(200).json({
      result: "success",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const getTransactionInfo = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    const data = await transactionInfo(transaction_id);

    res.status(200).json({
      result: "success",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const createEvent = async (req, res) => {
  try {
    const { title, rate, time } = req.body;
    const result = await eventCreate(title, rate, time);
    if (result == true)
      res.status(200).json({
        result: "success",
      });
    else
      res.status(400).json({
        result: "failed",
        msg: "Server Error",
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const getStatistics = async (req, res) => {
  try {
    const data = await statisticsInfo();

    res.status(200).json({
      result: "success",
      data: data,
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
  getGateway,
  setGateway,
  getContact,
  setContact,
  transactionAnalytics,
  getUserTransaction,
  getUserAffiliates,
  getTransactionInfo,
  createEvent,
  getStatistics,
};
