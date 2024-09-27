const UserRoutes = require("./user.routes");
const AuthRoutes = require("./auth.routes");
const LessonRoutes = require("./lesson.routes");
const WordRoutes = require("./word.routes");
const PeriodRoutes = require("./period.routes");
const TopicRoutes = require("./topic.routes");
const UploadRoutes = require("./uploadImage.routes");

const routes = (app) => {
    app.use("/api/auth", AuthRoutes);
    app.use("/api/user", UserRoutes);
    app.use("/api/lessons", LessonRoutes);
    app.use("/api/words", WordRoutes);
    app.use("/api/periods", PeriodRoutes);
    app.use("/api/topics", TopicRoutes);
    app.use("/api", UploadRoutes);
};
  
module.exports = routes;
  