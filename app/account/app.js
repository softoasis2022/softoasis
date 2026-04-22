const express = require("express");
const routes = express.Router();

const loginroute = require("./login/app");
const findroute = require("./find/app");
const passwordresetroute = require("./passwordreset/app");
const signuproute = require("./signup/app");

routes.use("/login",loginroute);
routes.use("/find",findroute);
routes.use("/passwordreset",passwordresetroute);
routes.use("/signup",signuproute);
routes.get("/check", (req, res) => {
  const userid = req.cookies?.userid;

  if (!userid) {
    return res.json({ login: false });
  }

  return res.json({
    login: true,
    userid
  });
});

module.exports = routes;