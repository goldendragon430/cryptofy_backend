const express = require("express");
const userMiddleware = require("../Middleware/validator.middleware");
const transactionControllers = require("../Controllers/transaction.Controllers");
const router = express.Router();

router.post("/get", userMiddleware, transactionControllers.getTransaction);
router.post("/all", transactionControllers.allTrnasaction);

module.exports = router;
