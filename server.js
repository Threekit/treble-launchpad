const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { updateCatalogThumbnails } = require("./utils");

const app = express();

const PORT = 4000;

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

app.get("/api/health", (req, res) => {
  res.status(200).send({ message: "server healthy!" });
});

app.use("*", (req, res, next) => {
  // const hostname = "humantouch.dev.3kit.com";
  const env = req.hostname.split(".3kit")[0].split(".")[1];
  express.static(path.join(__dirname, `build/${env}`))(req, res, next);
});

app.listen(PORT, () => console.log("listening on port: ", PORT));
