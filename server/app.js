const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

dotenv.config({ path: "./config.env" });

require("./db/conn");

app.use(require("./routers/user"));
app.use(require("./routers/content"));
app.use(require("./routers/comment"));
app.use(require("./routers/reply"));

app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Hello from Server");
});

app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
});
