const express = require("express");
const routes = express.Router();
const cookieParser = require("cookie-parser");

routes.use(cookieParser());

const loginroute = require("./login/app");
const findroute = require("./find/app");
const passwordresetroute = require("./passwordreset/app");
const signuproute = require("./signup/app");


routes.use("/login",loginroute);
routes.use("/find",findroute);
routes.use("/passwordreset",passwordresetroute);
routes.use("/signup",signuproute);
routes.get("/check", (req, res) => {
  const sessionid = req.cookies?.sessionid;
  console.log(sessionid);

  if (!sessionid) {
    return res.json({ login: false });
  }

  return res.status(200).json({
    login: true
  });
});

module.exports = routes;