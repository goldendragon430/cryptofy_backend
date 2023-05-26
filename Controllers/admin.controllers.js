const bcrypt = require("bcrypt");

var { getUserList, suspendUser } = require("../Models/user.js");

const getUsersData = async (req, res) => {
  try {
    const userinfo = await getUserList();
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

module.exports = {
  getUsersData,
  setUserState,
};
