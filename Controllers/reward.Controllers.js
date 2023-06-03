const bcrypt = require("bcrypt");

var {
  createReward,
  getUserReward,
  getAffiliateInfo,
  getAffiliateTrs,
} = require("../Models/Reward");
const { addCurrentPower } = require("../Models/Mining");

const addReward = async (req, res) => {
  try {
    const user_id = req.user;
    const bonus = Math.floor(5 * Math.random());
    var result = await createReward("random", 0, bonus, user_id);

    if (result == true) {
      result = addCurrentPower(user_id, bonus);
      if (result) {
        res.status(200).json({
          result: "success",
          bonus: bonus,
        });
      } else {
        res.status(200).json({
          result: "failed",
          data: "Server Error",
        });
      }
    } else {
      res.status(200).json({
        result: "failed",
        data: "Server Error",
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
const getReward = async (req, res) => {
  try {
    const user_id = req.user;
    const rewards = await getUserReward(user_id);
    res.status(200).json({
      result: "success",
      data: rewards,
    });
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const getAffiliate = async (req, res) => {
  try {
    const user_id = req.user;
    const data = await getAffiliateInfo(user_id);
    res.status(200).json({
      result: "success",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

const getAffTransaction = async (req, res) => {
  try {
    const user_id = req.user;
    const data = await getAffiliateTrs(user_id);
    res.status(200).json({
      result: "success",
      data: data,
    });
  } catch (err) {
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};

module.exports = {
  addReward,
  getReward,
  getAffiliate,
  getAffTransaction,
};
