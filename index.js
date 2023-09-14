require("babel-register");
const request = require("request");

const { bot } = require("./controller/prepare");
const { initLogin } = require("./controller/login");
const { initLoop } = require("./controller/loop");

initLogin(bot);
initLoop(bot);
