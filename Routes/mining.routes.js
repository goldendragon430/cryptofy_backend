const express = require("express");
const userMiddleware = require("../Middleware/validator.middleware");
const miningControllers = require("../Controllers/mining.Controllers");
const router = express.Router();

router.post("/get_power", userMiddleware, miningControllers.getPower);
router.post("/set_power", userMiddleware, miningControllers.setPower);
router.post("/reinvest", userMiddleware, miningControllers.reinvest);
router.post("/withdrawal", userMiddleware, miningControllers.withdrawl);
router.post("/check_deposite", userMiddleware, miningControllers.checkDeposite);
router.post("/invest_plan", userMiddleware, miningControllers.investPlan);
router.post("/test", userMiddleware, miningControllers.test);
router.post(
  "/get_configuration",
  userMiddleware,
  miningControllers.getConfiguration
);
router.post(
  "/update_configuration",
  userMiddleware,
  miningControllers.updateConfiguration
);
router.post(
  "/get_plan_config",
  userMiddleware,
  miningControllers.getPlanConfiguration
);
router.post(
  "/update_plan_config",
  userMiddleware,
  miningControllers.updatePlanConfiguration
);

module.exports = router;
