require("dotenv").config();

var express = require("express");
var logger = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");
var requestIp = require("request-ip");
var con = require("./Models/connection.js");
var app = express();
var PORT = process.env.PORT;
var usersRouter = require("./Routes/users.routes");
var adminRouter = require("./Routes/admin.routes");
var rewardRouter = require("./Routes/reward.routes");
var miningRouter = require("./Routes/mining.routes");
var transactionRouter = require("./Routes/transaction.routes");
var fileURLToPath = require("url");
var path = require("path");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(requestIp.mw());
app.use(cors({}));

app.use("/user", usersRouter);
app.use("/admin", adminRouter);
app.use("/reward", rewardRouter);
app.use("/mining", miningRouter);
app.use("/transaction", transactionRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   ~res.status(404).json({
//     message: "No such route exists",
//   });
// });

// error handler
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500).json({
//     message: "Error Message",
//   });
// });

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT || 5000, () => {
  console.log(`server started on PORT ${PORT}`);
});
