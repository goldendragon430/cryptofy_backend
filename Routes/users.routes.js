const express = require("express");
const checkAuth = require("../Middleware/validator.middleware");
const userControllers = require("../Controllers/users.controllers");
const router = express.Router();

router.post("/signup", userControllers.userRegister);
router.post("/login", userControllers.userLogin);
router.post("/get_deposite_address", checkAuth, userControllers.userAddress);
router.post("/send_code", checkAuth, userControllers.sendCode);
router.post("/confirm_code", checkAuth, userControllers.confirmCode);
router.post("/details", checkAuth, userControllers.getDetails);
router.post("/send_contact", userControllers.sendContacts);

module.exports = router;
