const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

const PORT = process.env.PORT || 5000;

const app = express();

dotenv.config();
require("./db/connection.js");
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
const adminRoute = require('./routes/adminRoutes.js');
// const isPage  = require("./middlewares/isPage.js")

// app.use(isPage.isPage)
app.use('/',adminRoute)


app.listen(PORT, () => {
    console.log(`server running in port no ${PORT}`)
})
