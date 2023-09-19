const terminalImage = require('terminal-image');
const showImg = (data) =>{
  setTimeout( async () => {
    console.log(await terminalImage.file(data))    
  }, 500);

}
module.exports = {
  showImg
}