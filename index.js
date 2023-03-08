const app = require("express")();
const fs = require("fs");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("newtopic", (msg) => {
    fs.readdir("topics/", (err, files) => {
      fs.writeFileSync(
        "topics/" + files.length,
        msg +
          "ÆÅÄÃ" +
          (new Date().getDay() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear()) +
          "ÆÅÄÃ"
      );
    });
    io.emit("newtopic", msg);
  });
  
  socket.on("load", (msg) => {
    let i = fs.readdirSync("topics/").length;
    for (let j = 1; j < i; j++) {
      let content = fs.readFileSync(process.cwd() + "/topics/" + j).toString();
      socket.emit(
        "newtopic",
        content.split("ÆÅÄÃ")[0] + "ÆÅÄÃLÆÅÄÃ" + content.split("ÆÅÄÃ")[1]
      );
    }
  });

  socket.on("changetopic", (msg) => {
    let content = fs.readFileSync(process.cwd() + "/topics/" + msg).toString();
    socket.emit("changetopic", content);
    let fg = content.split("ÆÅÄÃ").splice(2).join("ÆÅÄÃ");
    fg = fg
      .substring(0, fg.length - 4)
      .split("ÆÅÄÃ")
      .join('</p><br><p class="chatt">');
    if (fg === "") {
      fg = "<p style='color: gray;margin-bottom: 5px'>topic created !</p>";
    } else {
      fg = "<p class='chatt'>" + fg + "</p><br>";
    }
    socket.emit("loads", fg);
    socket.on(msg, (msgg) => {
      fs.appendFileSync("topics/" + msg, msgg + "ÆÅÄÃ");
      io.emit("ms", msgg);
    });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
