const TronWeb = require("tronweb");
var crypto = require("crypto");
var { getAdminKey, getUserSKey } = require("../Models/user.js");
const fullNode = process.env.TRON_NET_RPC;
const solidityNode = process.env.TRON_NET_RPC;
const eventServer = process.env.TRON_NET_RPC;

const createAccount = async () => {
  var privateKey = crypto.randomBytes(32).toString("hex");
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
  const wallet = await tronWeb.createAccount();
  return {
    privatekey: wallet.privateKey,
    address: wallet.address.base58,
  };
};

const sendTron = async (address, amount) => {
  try {
    const admin_data = await getAdminKey();
    const pk = admin_data.data;
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, pk);
    const result = await tronWeb.trx.sendTransaction(address, amount * 1e6, pk);
    if (result.result == true) {
      console.log(`Withdrwal ${amount} TRX to ${address} successed`);
      return result.transaction.txID;
    } else {
      console.log("transaction error, balance low.");
      return "";
    }
  } catch (err) {
    console.log(err);
    return "";
  }
};

const collectTron = async (address, sk, amount) => {
  try {
    const admin_data = await getAdminKey();

    const to = admin_data.wallet;
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, sk);
    const result = await tronWeb.trx.sendTransaction(
      to,
      (amount - 1) * 1e6,
      sk
    );
    if (result.result == true) {
      console.log(`Deposite ${amount} TRX from ${address} successed`);
      return result.transaction.txID;
    } else {
      console.log("transaction error, balance low.");
      return "";
    }
  } catch (err) {
    console.log(err);
    return "";
  }
};

const getBalance = async (address) => {
  try {
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    const result = (await tronWeb.trx.getBalance(address)) / 1e6;
    return result;
  } catch (err) {
    console.log("get balance error", err);
    return 0;
  }
};
module.exports = {
  createAccount,
  sendTron,
  getBalance,
  collectTron,
};
