const bcrypt = require("bcrypt");

var {
  getTransactionList,
  allTrnasactionList,
} = require("../Models/Transaction");

const getTransaction = async (req, res) => {
  const { type } = req.body;
  const user_id = req.user;
  try {
    const transaction_list = await getTransactionList(type, user_id);
    res.status(200).json({
      result: "success",
      data: transaction_list,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      result: "failed",
      msg: "Server Error",
    });
  }
};
const allTrnasaction = async (req, res) => {
  try {
    const transaction_list = await allTrnasactionList();
    res.status(200).json({
      result: "success",
      data: transaction_list,
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
  getTransaction,
  allTrnasaction,
};
