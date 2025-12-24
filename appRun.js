const HTTP = require("http");
const APP = require("./app");
const PORT = process.env.PORT || 5000;
const server = HTTP.createServer(APP);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
