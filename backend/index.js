const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const history = require('connect-history-api-fallback');
const fs = require("fs");
var stream = require("stream");
var Keygrip = require("keygrip");
const session = require("cookie-session");
let db;
const cors = require("cors");
const argv = require('minimist')(process.argv.slice(2));

let backendonly = false;

if (argv['backend-only'] || argv.b) backendonly = true;
if (backendonly) {
    console.log('Running spikehub on the backend')
}

if (!backendonly) {
    let staticFileMiddleware = express.static(path.join(__dirname, '../dist'));
  
    app.use(history({
        rewrites: [
            {
                from: '/api/',
                to: function (context) {
                    return context.parsedUrl.pathname;
                }
            }
        ]
    }));
    app.use('/', staticFileMiddleware);
  }

app.use(
  cors({
    origin: require("./config.json").frontend_url,
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(express.json());
app.use(
  session({
    keys: ["key1", "key2"],
    // keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64')
    maxAge: 24 * 60 * 60 * 1000,
    name: "sesh",
    secure: false,
  })
);

const mongoUrl = "mongodb://cl8rnk0op0003copf1ayk0pqb:IJwsiSQOPmATYn346qzjF2HL@194.5.152.195:1026/";
const connect = mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((connection) => {
    console.log("Connected to MongoDB");
    db = connection;
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const file = new mongoose.Schema({
  name: String,
  id: Number,
  uploaded: Date,
  user: String,
  data: Buffer,
  commitMessage: String,
});

const files = mongoose.model("files", file);

async function checkLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send("Not logged in");
  }
}

app.post("/api/upload", checkLogin, async (req, res) => {
  // get the number of files in the database and add 1 to it using mongoose
  const count = await files.countDocuments({});

  const f = files
    .create({
      name: req.body.name,
      uploaded: new Date(),
      user: req.session.user,
      data: req.body.data,
      commitMessage: req.body.commitMessage,
      id: count + 1,
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/files", checkLogin, (req, res) => {
  files
    .find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api/login", async (req, res) => {
  const passcode = require("./config.json").passcode;
  const username = req.body.username;
  const password = req.body.passcode;
  const users = require("./users.json").users;
  if (password === passcode && users.includes(username)) {
    req.session.user = username;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.get("/api/currentUser", (req, res) => {
  res.json({ user: req.session.user });
});

app.get("/api/files/download/:id", checkLogin, (req, res) => {
  files
    .findOne({ id: req.params.id })
    .then((result) => {
      // use res.download to download the file
      var fileContents = Buffer.from(result.data, "zip");
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);

      res.set("Content-disposition", "attachment; filename=" + 'SPIKEHUB_' + result.id + '.lms');
      res.set("Content-Type", "application/zip");

      console.log('downloaded file ' + result.id);
      readStream.pipe(res);
    })
    .catch((err) => {
      res.json(err);
      console.error(err);
    });
});

app.get("/api/files/get/:id", checkLogin, (req, res) => {
  files
    .findOne({ id: req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/files/count", (req, res) => {
  files
    .countDocuments()
    .then((result) => {
      res.json({ results: result });
    })
    .catch((err) => {
      res.json({ results: err });
    });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
