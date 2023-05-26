const express = require("express");
const userMiddleware = require("../Middleware/validator.middleware");
const rewardControllers = require("../Controllers/reward.Controllers");
const router = express.Router();

router.post("/add_reward", userMiddleware, rewardControllers.addReward);
router.post("/get_reward", userMiddleware, rewardControllers.getReward);

module.exports = router;
