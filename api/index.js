const express = require("express");
const io = require("./socket");
// const session = require("express-session");
// const passport = require("passport");
const app = express();

// const sessionMiddleware = session({
//   secret: "changeit",
//   resave: false,
//   saveUninitialized: false,
// });
// app.use(sessionMiddleware);
// app.use(passport.initialize());
// app.use(passport.session());

// const DUMMY_USER = {
//   id: 1,
//   username: "user",
//   password: "pass",
// };

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     if (username === "user" && password === "pass") {
//       console.log("authentication OK");
//       return done(null, DUMMY_USER);
//     } else {
//       console.log("wrong credentials");
//       return done(null, false);
//     }
//   })
// );

const port = 5000;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

io.attach(server);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
