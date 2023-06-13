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
var multiparty = require("multiparty");
var fileURLToPath = require("url");
var path = require("path");
var fs = require("fs");
var fs_mover = require("fs-extra");
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
app.get("/get_file", (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "./images");
    var pathname = directoryPath + "/" + req.query.name;
    // console.log(pathname,"profile")
    fs.readFile(pathname, function (err, data) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        // if the file is found, set Content-type and send data
        res.setHeader("Content-type", "image/png");
        res.end(data);
      }
    });
  } catch (err) {
    console.log(err, "get file error");
  }
});
app.post("/upload_file", (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "./images");
    var pathname = directoryPath + "/" + req.query.name;
    // console.log(pathname,"profile")
    var form_data = new multiparty.Form();
    form_data.parse(req, async function (err, fields, files) {
      if (files.files) {
        var sourcePath = files.files[0].path;
        fs.exists(pathname, function (exists) {
          if (exists) {
            //Show in green
            fs.unlinkSync(pathname);

            fs_mover.move(sourcePath, pathname, function (err) {
              if (err) return console.error(err);
              res.end("success");
            });
          } else {
            fs_mover.move(sourcePath, pathname, function (err) {
              if (err) return console.error(err);
              res.end("success");
            });
          }
        });
      }
    });
  } catch (err) {
    console.log(err, "get file error");
  }
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT || 5000, () => {
  console.log(`server started on PORT ${PORT}`);
});
