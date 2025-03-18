import express from "express";
import configViewEngine from "./config/viewengine";
import path from "path";
import cookieParser from "cookie-parser";
import initApiRouter from "./routes/api";
import bodyParser from "body-parser";
import configCors from "./config/cors";
//import connection from "./config/connectDB";
require("dotenv").config();

const app = express();
app.use(cookieParser());
//confif cors
configCors(app);
//config view engine
configViewEngine(app);

//config bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
//connection();

//init web routes

initApiRouter(app);

const PORT = process.env.PORT || 8080;
app.use((req, res) => {
    return res.send("404 not found from backend");
});
app.listen(PORT, () => {
    console.log(">>> Server is running on http://localhost:" + PORT);
});
