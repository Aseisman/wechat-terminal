const qrcode = require("qrcode-terminal");
const fs = require("fs");

function initLogin(bot) {
  /**
   * uuid事件，参数为uuid，根据uuid生成二维码
   */
  bot.on("uuid", (uuid) => {
    qrcode.generate("https://login.weixin.qq.com/l/" + uuid, {
      small: true,
    });
    console.log("二维码链接：", "https://login.weixin.qq.com/qrcode/" + uuid);
  });
  /**
   * 登录用户头像事件，手机扫描后可以得到登录用户头像的Data URL
   */
  bot.on("user-avatar", (avatar) => {
    // console.log("登录用户头像Data URL：", avatar);
  });
  /**
   * 登录成功事件
   */
  bot.on("login", () => {
    console.log("登录成功");
    // 保存数据，将数据序列化之后保存到任意位置
    fs.writeFileSync("./sync-data.json", JSON.stringify(bot.botData));
  });
  /**
   * 登出成功事件
   */
  bot.on("logout", () => {
    console.log("登出成功");
    // 清除数据
    fs.unlinkSync("./sync-data.json");
  });
}
module.exports = { initLogin };
