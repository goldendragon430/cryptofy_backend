const express = require("express");
const adminMiddleware = require("../Middleware/admin.middleware");
const adminControllers = require("../Controllers/admin.Controllers");
const router = express.Router();

router.post("/get_user_list", adminMiddleware, adminControllers.getUsersData);
router.post("/set_user_state", adminMiddleware, adminControllers.setUserState);
router.post("/user_analytics", adminMiddleware, adminControllers.userAnalytics);
router.post(
  "/mining_analytics",
  adminMiddleware,
  adminControllers.miningAnalytics
);
router.post(
  "/registered_users",
  adminMiddleware,
  adminControllers.userRegisters
);
router.post("/user_details", adminMiddleware, adminControllers.userDetails);
router.post(
  "/get_staking_plan",
  adminMiddleware,
  adminControllers.getStakingPlan
);
router.post(
  "/get_transaction",
  adminMiddleware,
  adminControllers.getTransaction
);

module.exports = router;
