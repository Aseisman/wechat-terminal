// const sharp = require("sharp");
// require("console-png").attachTo(console);

// const index = 0;
// sharp("./media/[群] 2023软件设计师13群-54387146507243292.gif")
//   .rotate()
//   .resize(50)
//   .toFile("./media/" + index +'.png',(err,info)=>{
//     if(err){
//       console.log(err);
//     }
//     console.png("./media/" + index +'.png')
//   });
const { showImg } = require("./controller/showImg");
const fs = require("fs");

let data = fs.readFileSync("./media/[群] 2023软件设计师13群-54387146507243292.gif");
console.log(data);
showImg(data);