const express = require("express");
const dotenv = require("dotenv");

const app = express();
const router = require("./routes/index");

dotenv.config();

const PORT = process.env.PORT;

// middleware use json response
app.use(express.json());

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Running server in http://localhost:${PORT}`);
});
