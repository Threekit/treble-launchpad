const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { updateCatalogThumbnails } = require("./utils");

const app = express();

const PORT = 80;

app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

app.get("/api/health", (req, res) => {
  res.status(200).send({ message: "server healthy!" });
});

app.post("/api/hook", async (req, res) => {
  if (!req.body.data.title.includes("_thumbnail"))
    return res.status(200).json({
      message: `Renders Ignored: Title did not include '_thumbnail'.`,
    });

  const catalog = await updateCatalogThumbnails(req.body.data);

  const productsList = catalog.products.map((el) => el.name);

  res.status(200).json({
    message: `Updated ${catalog.products.length} products listed below.`,
    products: productsList,
  });
});

app.use("/", express.static(path.join(__dirname, "build")));

app.listen(PORT, () => console.log("listening on port: ", PORT));
