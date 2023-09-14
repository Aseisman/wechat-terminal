require("babel-register");

const fs = require("fs");
const request = require("request");

const { bot } = require("./controller/prepare");
const { initLogin } = require("./controller/login");

initLogin(bot);

bot.on("message", (msg) => {
  const name = bot.contacts[msg.FromUserName].getDisplayName();
  const fileName = name+'.txt';
  const time = msg.getDisplayTime();

  console.log(`----------${time}----------`);
  console.log(name);

  switch (msg.MsgType) {
    case bot.CONF.MSGTYPE_TEXT:
      // 文本
      console.log(msg.Content);
      fs.appendFileSync(fileName, `${name}(${time}):${msg.MsgType}\n`);
      break;
    case bot.CONF.MSGTYPE_IMAGE:
      // 图片消息
      console.log("图片消息，保存到本地");
      fs.appendFileSync(fileName, `${name}(${time}):[图片](${name + "-" + msg.MsgId + '.jpg'})\n`);
      bot
        .getMsgImg(msg.MsgId)
        .then((res) => {
          fs.writeFileSync(`./media/${name + "-" + msg.MsgId}.jpg`, res.data);
        })
        .catch((err) => {
          bot.emit("error", err);
        });
      break;
    case bot.CONF.MSGTYPE_VOICE:
      // 语音消息
      console.log("语音消息，保存到本地");
      fs.appendFileSync(fileName, `${name}(${time}):[语音](${name + "-" + msg.MsgId + '.mp3'})\n`);
      bot
        .getVoice(msg.MsgId)
        .then((res) => {
          fs.writeFileSync(`./media/${name + "-" + msg.MsgId}.mp3`, res.data);
        })
        .catch((err) => {
          bot.emit("error", err);
        });
      break;
    case bot.CONF.MSGTYPE_EMOTICON:
      // 表情消息
      console.log("表情消息，保存到本地");
      fs.appendFileSync(fileName, `${name}(${time}):[表情](${name + "-" + msg.MsgId + '.gif'})\n`);
      bot
        .getMsgImg(msg.MsgId)
        .then((res) => {
          fs.writeFileSync(`./media/${name + "-" + msg.MsgId}.gif`, res.data);
        })
        .catch((err) => {
          bot.emit("error", err);
        });
      break;
    case bot.CONF.MSGTYPE_VIDEO:
    case bot.CONF.MSGTYPE_MICROVIDEO:
      // 视频消息
      console.log("视频消息，保存到本地");
      fs.appendFileSync(fileName, `${name}(${time}):[视频](${name + "-" + msg.MsgId + '.mp4'})\n`);
      bot
        .getVideo(msg.MsgId)
        .then((res) => {
          fs.writeFileSync(`./media/${name + "-" + msg.MsgId}.mp4`, res.data);
        })
        .catch((err) => {
          bot.emit("error", err);
        });
      break;
    case bot.CONF.MSGTYPE_APP:
      if (msg.AppMsgType == 6) {
        // 文件消息
        console.log("文件消息，保存到本地");
      fs.appendFileSync(fileName, `${name}(${time}):[文件](${name + "-" + msg.MsgId + '.mp4'})\n`);
        bot
          .getDoc(msg.FromUserName, msg.MediaId, msg.FileName)
          .then((res) => {
            fs.writeFileSync(`./media/${msg.FileName}`, res.data);
            console.log(res.type);
          })
          .catch((err) => {
            bot.emit("error", err);
          });
      }
      break;
    default:
      break;
  }
});
