const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { userJoin, userLeave, getCurrentUser, getRoomUsers } = require("./utils/users");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Botname
const botName = "ChatBro Bot";

// Run when client connects
io.on("connection", (socket) => {
	socket.on("joinRoom", ({ username, room }) => {
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// Welcome current user
		socket.emit("message", formatMessage(botName, `${user.username}, welcome to ChatBro`));

		// Broadcast when new user enters
		socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has entered the room`));

		// Send room name and users
		io.to(user.room).emit("roomInfo", {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	// Listen to chat message
	socket.on("chatMessage", (msg) => {
		const user = getCurrentUser(socket.id);

		// Sending message to the clients
		io.to(user.room).emit("message", formatMessage(user.username, msg));
	});

	// Broadcast when user leaves
	socket.on("disconnect", () => {
		const user = userLeave(socket.id);
		if (user) {
			socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the room`));
			io.to(user.room).emit("roomInfo", {
				room: user.room,
				users: getRoomUsers(user.room),
			});
		}
	});
});

// Server listener
server.listen(port, () => {
	console.log(`ChatBro listening on port ${port}`);
});
