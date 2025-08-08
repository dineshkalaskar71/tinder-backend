const express = require('express')
const connectdb = require("./config/database")
const cors = require('cors')
const cookieparser = require('cookie-parser')


const authrouter = require("./routes/auth");
const profilerouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

const app = express()

app.use(express.json())
app.use(cookieparser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/", authrouter);
app.use("/", profilerouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectdb()
    .then(() => {
        console.log("connected");
       app.listen(200, "0.0.0.0", () => {
  console.log("Listening on port 200");
});
    }).catch(error => {
        console.log("error while connecting");

    })
