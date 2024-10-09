const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./configs/connectDb");
require("./configs/dayjsConfig");
const routes = require("./routes");
const fileUpload = require('express-fileupload');
const process = require("process"); // Add this line to import the 'process' module

const app = express();
const server = http.createServer(app); // thiết lập socket io cho sau này

dotenv.config();

// Configure CORS
app.use(cors({
    origin: process.env.FRONTEND_URL | 'http://localhost:3000', // Specify the frontend domain
    credentials: true, // Allow sending cookies with requests
}));

// Cookie parser
app.use(cookieParser());

// congfig fileUpload
app.use(fileUpload(
    { 
        useTempFiles: true, // Sử dụng file tạm thời (nếu không, file sẽ được giữ trong bộ nhớ)
    }
));

// config data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());

routes(app);


// start app
const port = process.env.PORT || 3001;

const startApp = () => {
    server.listen(port, () => {
        console.log("Server is running in port: " + `http://localhost:${port}` + " cors🚀" + process.env.FRONTEND_URL);
    });
}

;(async () => {
    try {
        await connectDb();
        startApp()
    } catch (error) {
        console.log('Connection DB Error: ', error);
    }
})();
  