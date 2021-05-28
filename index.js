require("dotenv").config();

const { ethers } = require("ethers");
const express = require("express");
const sharp = require("sharp");

const { renderSvg, generateFaces } = require("./lib/face");
const htmlSafe = require("./lib/html-safe");

const AsciiFaces = require("./abis/AsciiFaces.json");

const app = express();

const providers = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(
  contractAddress,
  AsciiFaces.abi,
  providers
);

const handleErrors = (err, req, res, next) => {
  return res.status(500).json({
    status: "error",
    message: err.message,
  });
};

app.use(handleErrors);

app.get("/faces/:id", async (req, res) => {
  const { id } = req.params;

  const totalSupply = await contract.totalSupply();
  const total = Number(totalSupply);

  if (Number(id) > total || Number(id) <= 0) {
    return res.status(404).json({ message: "Query nonexistent token" });
  }

  res.json({
    name: `ASCII Faces #${id}`,
    description: "",
    image: `http://localhost:3000/faces/${id}/image.svg`,
    attributes: [],
    background_color: "000000",
  });
});

app.get("/faces/:id/image.svg", async (req, res, next) => {
  const { id } = req.params;

  const totalSupply = await contract.totalSupply();
  const total = Number(totalSupply);

  if (Number(id) > total || Number(id) <= 0) {
    return res.status(404).json({ message: "Query nonexistent token" });
  }

  try {
    const face = await contract.getFace(id);
    const text = htmlSafe(face);
    const svg = renderSvg(text);

    return res.type("svg").send(Buffer.from(svg));
  } catch (err) {
    next(err);
  }
});

app.get("/faces/:id/image.png", async (req, res) => {
  const { id } = req.params;

  const text = htmlSafe(generateFaces(id));

  const svg = renderSvg(text);

  try {
    const png = await sharp(Buffer.from(svg), { density: 300 })
      .png()
      .toBuffer();

    return res.type("png").send(png);
  } catch (err) {
    console.log(err);
  }

  res.type("svg").send(Buffer.from(image));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
