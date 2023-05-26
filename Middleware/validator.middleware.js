const jwt = require("jsonwebtoken");
const { isExistUserById, getUserData } = require("../Models/user.js");
module.exports = async function (req, res, next) {
  const body = req.body;
  if (!body)
    return res.status(400).send({
      result: "failed",
      msg: "empty request",
    });
  const token = body.token;
  try {
    const verified = jwt.verify(token, process.env.jwtSecret);
    const user_id = verified.userId;
    const verify_result = await isExistUserById(user_id);
    if (verify_result) {
      const userinfo = await getUserData(user_id);
      if (userinfo.state == 1) {
        req.user = user_id;
        next();
      } else {
        res.status(400).send({ result: "failed", msg: "You are suspended." });
      }
    } else res.status(400).send({ result: "failed", msg: "Not Registered." });
  } catch (err) {
    res.status(400).send({ error: "auth failed, check auth-token." });
  }
};
