// 保存聊天记录；
const message = {};
module.exports = {
  message,
};
/**
 * 如何发送消息
 */
bot.on("login", () => {
  /**
   * 演示发送消息到文件传输助手
   * 通常回复消息时可以用 msg.FromUserName
   */
  let ToUserName = "filehelper";

  /**
   * 发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])
   */
  bot
    .sendMsg("发送文本消息，可以包含emoji(😒)和QQ表情([坏笑])", ToUserName)
    .catch((err) => {
      bot.emit("error", err);
    });

  /**
   * 通过表情MD5发送表情
   */
  bot
    .sendMsg(
      {
        emoticonMd5: "00c801cdf69127550d93ca52c3f853ff",
      },
      ToUserName
    )
    .catch((err) => {
      bot.emit("error", err);
    });

  /**
   * 以下通过上传文件发送图片，视频，附件等
   * 通用方法为入下
   * file为多种类型
   * filename必填，主要为了判断文件类型
   */
  // bot.sendMsg({
  //   file: Stream || Buffer || ArrayBuffer || File || Blob,
  //   filename: 'bot-qrcode.jpg'
  // }, ToUserName)
  //   .catch(err => {
  //     bot.emit('error',err)
  //   })

  /**
   * 发送图片
   */
  bot
    .sendMsg(
      {
        file: request(
          "https://raw.githubusercontent.com/nodeWechat/wechat4u/master/bot-qrcode.jpg"
        ),
        filename: "bot-qrcode.jpg",
      },
      ToUserName
    )
    .catch((err) => {
      bot.emit("error", err);
    });

  /**
   * 发送表情
   */
  bot
    .sendMsg(
      {
        file: fs.createReadStream("./media/test.gif"),
        filename: "test.gif",
      },
      ToUserName
    )
    .catch((err) => {
      bot.emit("error", err);
    });

  /**
   * 发送视频
   */
  bot
    .sendMsg(
      {
        file: fs.createReadStream("./media/test.mp4"),
        filename: "test.mp4",
      },
      ToUserName
    )
    .catch((err) => {
      bot.emit("error", err);
    });

  /**
   * 发送文件
   */
  bot
    .sendMsg(
      {
        file: fs.createReadStream("./media/test.txt"),
        filename: "test.txt",
      },
      ToUserName
    )
    .catch((err) => {
      bot.emit("error", err);
    });

  /**
   * 发送撤回消息请求
   */
  bot
    .sendMsg("测试撤回", ToUserName)
    .then((res) => {
      // 需要取得待撤回消息的MsgID
      return bot.revokeMsg(res.MsgID, ToUserName);
    })
    .catch((err) => {
      console.log(err);
    });
});
/**
 * 如何处理红包消息
 */
bot.on("message", (msg) => {
  if (msg.MsgType == bot.CONF.MSGTYPE_SYS && /红包/.test(msg.Content)) {
    // 若系统消息中带有‘红包’，则认为是红包消息
    // wechat4u并不能自动收红包
  }
});
/**
 * 如何处理转账消息
 */
bot.on("message", (msg) => {
  if (
    msg.MsgType == bot.CONF.MSGTYPE_APP &&
    msg.AppMsgType == bot.CONF.APPMSGTYPE_TRANSFERS
  ) {
    // 转账
  }
});
/**
 * 如何处理撤回消息
 */
bot.on("message", (msg) => {
  if (msg.MsgType == bot.CONF.MSGTYPE_RECALLED) {
    // msg.Content是一个xml，关键信息是MsgId
    let MsgId = msg.Content.match(
      /<msgid>(.*?)<\/msgid>.*?<replacemsg><!\[CDATA\[(.*?)\]\]><\/replacemsg>/
    )[0];
    // 得到MsgId后，根据MsgId，从收到过的消息中查找被撤回的消息
  }
});
/**
 * 如何直接转发消息
 */
bot.on("message", (msg) => {
    // 不是所有消息都可以直接转发
    bot.forwardMsg(msg, "filehelper").catch((err) => {
      bot.emit("error", err);
    });
  });