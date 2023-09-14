/**
 * 如何处理好友请求消息
 */
bot.on("message", (msg) => {
  if (msg.MsgType == bot.CONF.MSGTYPE_VERIFYMSG) {
    bot
      .verifyUser(msg.RecommendInfo.UserName, msg.RecommendInfo.Ticket)
      .then((res) => {
        console.log(
          `通过了 ${bot.Contact.getDisplayName(msg.RecommendInfo)} 好友请求`
        );
      })
      .catch((err) => {
        bot.emit("error", err);
      });
  }
});
/**
 * 如何获取联系人头像
 */
bot.on("message", (msg) => {
  bot
    .getHeadImg(bot.contacts[msg.FromUserName].HeadImgUrl)
    .then((res) => {
      fs.writeFileSync(`./media/${msg.FromUserName}.jpg`, res.data);
    })
    .catch((err) => {
      bot.emit("error", err);
    });
});

/**
 * 联系人更新事件，参数为被更新的联系人列表
 */
bot.on("contacts-updated", (contacts) => {
    console.log(contacts);
    console.log("联系人数量：", Object.keys(bot.contacts).length);
  });