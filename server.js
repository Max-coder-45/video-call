const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { ExpressPeerServer } = require('peer');

const server = http.createServer(app);
const io = new Server(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});

app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
