const express = require("express");
const adminMiddleware = require("../Middleware/admin.middleware");
const adminControllers = require("../Controllers/admin.Controllers");
const router = express.Router();

router.post("/get_user_list", adminMiddleware, adminControllers.getUsersData);
router.post("/set_user_state", adminMiddleware, adminControllers.setUserState);

module.exports = router;
