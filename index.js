require("dotenv").config();

const express = require("express");
const { renderSvg, generateFaces } = require("./lib/face");
const htmlSafe = require("./lib/html-safe");

const app = express();

const port = process.env.PORT || 3000;

app.get("/faces/:id", async (req, res) => {
  const { id } = req.params;

  res.json({
    name: `ASCII Faces #${id}`,
    description: "",
    image: `http://localhost:3000/faces/${id}/image.svg`,
    attributes: [],
    background_color: "000000",
  });
});

app.get("/faces/:id/image.svg", async (req, res) => {
  const { id } = req.params;

  const text = htmlSafe(generateFaces(id));

  const image = renderSvg(text);

  res.type("svg").send(Buffer.from(image));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
