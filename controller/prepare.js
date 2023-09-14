const Wechat = require("wechat4u");

let bot;
try {
  bot = new Wechat(require("../sync-data.json"));
} catch (e) {
  bot = new Wechat();
}

if (bot.PROP.uin) {
  // 存在登录数据时，可以随时调用restart进行重启
  bot.restart();
} else {
  bot.start();
}
/**
 * 错误事件，参数一般为Error对象
 */
bot.on("error", (err) => {
  console.error("错误：", err);
});

module.exports = {
  bot,
};
