const express = require("express");
const userMiddleware = require("../Middleware/validator.middleware");
const rewardControllers = require("../Controllers/reward.Controllers");
const router = express.Router();

router.post("/add_reward", userMiddleware, rewardControllers.addReward);
router.post("/get_reward", userMiddleware, rewardControllers.getReward);
router.post("/get_affiliate", userMiddleware, rewardControllers.getAffiliate);
router.post(
  "/get_aff_transactions",
  userMiddleware,
  rewardControllers.getAffTransaction
);

module.exports = router;
