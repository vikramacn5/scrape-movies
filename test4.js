const { spawn } = require("node:child_process");

let timer = 1;
const testInterval = setInterval(() => {
  if (timer === 2) {
    const test = spawn(
      "node",
      ["./sendMessage.js", "+919677289976,+919444152023", "hello"],
      { detached: true }
    );

    test.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    test.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });
    test.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
    });
  } else if (timer === 8) {
    clearInterval(testInterval);
  }
  console.log(timer);
  timer++;
}, 5000);
