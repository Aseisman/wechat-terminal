let terminalImage;

const showImg = async (data) => {
  !terminalImage && (terminalImage = (await import("terminal-image")).default);
  terminalImage.file(data).then((res) => {
    console.log(res);
  });
};
module.exports = {
  showImg,
};
