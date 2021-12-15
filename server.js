const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { updateCatalogThumbnails } = require("./utils");

const app = express();

const PORT = 80;

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

app.get("/api/health", (req, res) => {
  res.status(200).send({ message: "server healthy!" });
});

app.use("/", (req, res, next) => {
  const env = req.subdomains[0] || "dev";
  req.url = `/${env}${req.originalUrl}`;
  console.log(`url transform: ${req.originalUrl} -> ${req.url}`);
  next();
});

app.use(express.static(path.join(__dirname, "build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.listen(PORT, () => console.log("listening on port: ", PORT));
