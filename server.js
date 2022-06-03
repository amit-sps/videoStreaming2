const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write("<h1>Home Page</h1>");
      res.end();
    }
    else if(req.url==="/video"){
       const{range}=req.headers;
       if(!range||range===undefined){
           res.writeHead(400,{"Content-Type":"text/json"})
           res.write("Bad Request!");
           res.end();
           return
        }
        console.log(path.join(__dirname,"../videoStreamingApp/videos/video.mp4"))
        const {size}=fs.statSync(path.join(__dirname,"../videoStreamingApp/videos/video.mp4"))
        console.log(size)
        // \d is used for remove all numeric value from string and \D is used for
        // remove all non numeric value from string!
        const from=Number(range.replace(/\D/g,""))
        const chunk=1+1e+6;
        const end=Math.min(from+chunk,size)
        // Syntax For Content-Range
        // Content-Range: <unit> <range-start>-<range-end>/<size>
        // Content-Range: bytes 200-1000/67589
        const headers={
            "Content-Range":`bytes ${from}-${end}/${size}`,
            "Accept-Range":"bytes",
            "Content-Length":size,
            "Content-Type":"video/mp4"
        }
        res.writeHead(206,headers)
        const videoStream=fs.createReadStream(path.join(__dirname,"../videoStreamingApp/videos/video.mp4"),{start:from,end})
        videoStream.pipe(res)

    } else {
      res.writeHead(400, {
        "Content-Type": "text/json",
      });
      res.write("Bad Request!");
      res.end()
    }
  })
  .listen(5040, () => {
    console.log(`video streaming on http://localhost:5040`);
  });
