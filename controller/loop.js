const fs = require("fs");
const readline = require("readline");
const clipboardy = require("clipboardy");
const { showImg } = require("./showImg");

let reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let ToUserName = "";
let DisplayName = "";

function initLoop(bot) {
  // 接收消息
  bot.on("message", (msg) => {
    const fromName = bot.contacts[msg.FromUserName].getDisplayName();
    let toName;
    try {
      toName = bot.contacts[msg.ToUserName].getDisplayName();
    } catch (error) {
      console.log(msg.ToUserName);
      console.log(bot.contacts[msg.ToUserName]);
    }

    const log = (...sth) => !needHide && console.log(...sth);
    const checkNeedHide = () => {
      // 如果 不是特定的几个想展示的群消息，则隐藏消息；
      // 如果是 群聊已屏蔽的 or 是自己发送的，则隐藏消息；
      const isRoom =
        bot.Contact.isRoomContact(bot.contacts[msg.FromUserName]) &&
        bot.contacts[msg.FromUserName].Statues ==
          bot.CONF.CHATROOM_NOTIFY_CLOSE;

      if (isRoom && showMsgNames.includes(fromName)) return false;
      else if (isRoom) return true;
      else if (msg.isSendBySelf) return true;
      else return false;
    };

    const time = msg.getDisplayTime();
    const fileName = msg.isSendBySelf
      ? "./message/" + toName + ".txt"
      : "./message/" + fromName + ".txt";
    const showMsgNames = [];
    const needHide = checkNeedHide();

    if (bot.Contact.isPublicContact(bot.contacts[msg.FromUserName])) return; //屏蔽公众号消息

    log(`----------${time}----------`);
    log(fromName, `UserName:${msg.FromUserName}`);

    switch (msg.MsgType) {
      case bot.CONF.MSGTYPE_TEXT:
        // 文本
        log(msg.Content);
        fs.appendFileSync(fileName, `${fromName}(${time}):${msg.Content}\n`);
        break;
      case bot.CONF.MSGTYPE_IMAGE:
        // 图片消息
        log("图片消息，保存到本地");
        fs.appendFileSync(
          fileName,
          `${fromName}(${time}):[图片](${
            fromName + "-" + msg.MsgId + ".jpg"
          })\n`
        );
        bot
          .getMsgImg(msg.MsgId)
          .then((res) => {
            if(!res.data) return console.log('获取不到图片');
            fs.writeFileSync(
              `./media/${fromName + "-" + msg.MsgId}.jpg`,
              res.data
            );
            !needHide && showImg(`./media/${fromName + "-" + msg.MsgId}.jpg`);
          })
          .catch((err) => {
            bot.emit("error", err);
          });
        break;
      case bot.CONF.MSGTYPE_VOICE:
        // 语音消息
        log("语音消息，保存到本地");
        // log("语音消息");
        fs.appendFileSync(
          fileName,
          `${fromName}(${time}):[语音](${
            fromName + "-" + msg.MsgId + ".mp3"
          })\n`
        );
        bot
          .getVoice(msg.MsgId)
          .then((res) => {
            fs.writeFileSync(
              `./media/${fromName + "-" + msg.MsgId}.mp3`,
              res.data
            );
          })
          .catch((err) => {
            bot.emit("error", err);
          });
        break;
      case bot.CONF.MSGTYPE_EMOTICON:
        // 表情消息
        log("表情消息，保存到本地");
        fs.appendFileSync(
          fileName,
          `${fromName}(${time}):[表情](${
            fromName + "-" + msg.MsgId + ".gif"
          })\n`
        );
        bot
          .getMsgImg(msg.MsgId)
          .then((res) => {
            fs.writeFileSync(
              `./media/${fromName + "-" + msg.MsgId}.gif`,
              res.data
            );
            !needHide && showImg(`./media/${fromName + "-" + msg.MsgId}.gif`);
          })
          .catch((err) => {
            bot.emit("error", err);
          });
        break;
      case bot.CONF.MSGTYPE_VIDEO:
      case bot.CONF.MSGTYPE_MICROVIDEO:
        // 视频消息
        log("视频消息，保存到本地");
        fs.appendFileSync(
          fileName,
          `${fromName}(${time}):[视频](${
            fromName + "-" + msg.MsgId + ".mp4"
          })\n`
        );
        bot
          .getVideo(msg.MsgId)
          .then((res) => {
            fs.writeFileSync(
              `./media/${fromName + "-" + msg.MsgId}.mp4`,
              res.data
            );
          })
          .catch((err) => {
            bot.emit("error", err);
          });
        break;
      case bot.CONF.MSGTYPE_APP:
        if (msg.AppMsgType == 6) {
          // 文件消息
          log("文件消息，保存到本地");
          fs.appendFileSync(
            fileName,
            `${fromName}(${time}):[文件](${
              fromName + "-" + msg.MsgId + ".mp4"
            })\n`
          );
          bot
            .getDoc(msg.FromUserName, msg.MediaId, msg.FileName)
            .then((res) => {
              fs.writeFileSync(`./media/${msg.FileName}`, res.data);
              log(res.type);
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
  // 监听消息
  reader.on("line", function (line) {
    let words = line.trim().split(" ");

    if (!words.length) return console.log("请重新输入");

    if (
      !["chat", "unchat", "logout", "close"].includes(words[0]) &&
      !ToUserName
    ) {
      return console.log("先选择当前聊天对象");
    }

    switch (words[0]) {
      case "chat": //选择聊天对象
        try {
          if (/^@/.test(words[1])) {
            // 是ToUserName
            ToUserName = words[1];
            let name = bot.contacts[ToUserName].getDisplayName();
            DisplayName = name;
          } else {
            // 是微信名称or微信备注
            let name = Object.keys(bot.contacts).find((key) => {
              const {
                DisplayName: dn,
                RemarkName,
                NickName,
              } = bot.contacts[key];
              return [dn, RemarkName, NickName].includes(words[1]);
            });
            if (!name) return console.log("聊天对象有误，请重新选择聊天对象");
            ToUserName = name;
            DisplayName = bot.contacts[ToUserName].getDisplayName();
          }
          console.log("当前聊天对象为：", DisplayName);
        } catch (error) {
          ToUserName = "";
          DisplayName = "";
          console.log("聊天对象有误，请重新选择聊天对象");
        }
        break;
      case "unchat": //退出当前聊天对象；
        ToUserName = "";
        break;
      case "logout": //logout
      case "close":
        bot.stop();
        reader.close();
        break;
      case "text":
        // text 你是不是傻子啊
        bot.sendMsg(words[1], ToUserName).catch((err) => {
          bot.emit("error", err);
        });
        DisplayName = DisplayName || bot.contacts[ToUserName].getDisplayName();
        fs.appendFileSync(
          "./message/" + DisplayName + ".txt",
          `我(${new Date().toLocaleDateString().split("/").join(":")}):${
            words[1]
          }\n`
        );
        break;
      case "photo":
        // photo ./media/xxx.png
        try {
          let file = fs.createReadStream(words[1]);
          let urls = words[1].split("/");
          let filename = urls[urls.length - 1];
          console.log(filename);
          bot
            .sendMsg(
              {
                file,
                filename,
              },
              ToUserName
            )
            .catch((err) => {
              console.log(err);
              bot.emit("error", err);
            });
        } catch (error) {
          console.log(error);
          console.log("找不到图片，请重新选择");
        }
        break;
      case "getCC":
        clipboardy.writeSync(JSON.stringify(bot.contacts[ToUserName]));
        console.log("已复制到剪贴板");
        break;
      default:
        console.log("没有找到命令！");
        break;
    }
  });

  setTimeout(() => {
    console.log("===============");
    console.log(
      "聊天格式为：《操作码：内容》; 例如：《chat 小白羊》 《text 这是测试语句》"
    );
    console.log("===============");
  }, 1000);
}

module.exports = { initLoop };
