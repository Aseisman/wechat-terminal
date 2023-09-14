
const { WechatyBuilder } = require('wechaty');
const wechaty = WechatyBuilder.build()
wechaty
  .on('scan', onScan)
  .on('login', user => console.log(`User ${user} logged in`))
  .on('logout', user => console.log(`User ${user} logout`))
  .on('message',onMessage)

wechaty.start()

//  二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://wechaty.js.org/qrcode/',
    encodeURIComponent(qrcode),
  ].join('');
  console.log(qrcodeImageUrl);
}

function onMessage(message){
  console.log(message);
  console.log(JSON.stringify(message));
  console.log(message.toString());
}

