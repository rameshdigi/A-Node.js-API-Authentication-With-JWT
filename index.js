const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

//import Routes
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
dotenv.config();

//connect to DB
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Mongodb connected...")
);

//Middle
app.use(express.json());

//Middleware Routes
app.use("/api/user", authRoute);
app.use("/api/post", postRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
