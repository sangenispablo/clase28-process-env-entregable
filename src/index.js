// dotenv para leer los archivos .env
require("dotenv").config();

// parametros
const { argv } = require("./helpers/utils");

// express y express-session
const express = require("express");
const session = require("express-session");

// persistir la session en mongodb
const MongoStore = require("connect-mongo");

// passport
const passport = require("passport");

// inicializo los middlewares
const { initializePassport } = require("./middlewares/passport.config");

// mongo
const { dbConnection } = require("./database/config");

// rutas
const serverRouter = require("./routes/serverRouter");
const apiRouter = require("./routes/apiRouter");

// env port
const PORT = Number(argv.p || process.env.PORT || 8080);

const app = express();

initializePassport();

app.use(
  session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_CNN_LOCAL }),
    secret: process.env.SECRET,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: Number(process.env.TIME_SESSION),
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.static("src/public"));
app.use(express.urlencoded({ extended: true }));

// mis rutas
app.use("/", serverRouter);
app.use("/api", apiRouter);

// conecto a Mongo
dbConnection();

// start server
app.listen(PORT, () => {
  console.log(`API esta escuchando el puerto: ${PORT}`);
});
