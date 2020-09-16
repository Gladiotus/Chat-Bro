const chatBox = document.querySelector(".chat-box");
const submitButton = document.querySelector(".send-message");
const messageInput = document.querySelector("#message");
const roomName = document.querySelector(".mobile-room-name");
const roomUsers = document.querySelector(".mobile-users-names");

const socket = io();

// Getting username and room from URL
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

// Join Room
socket.emit("joinRoom", { username, room });

// Catching message from server
socket.on("message", (msg) => {
	printMessage(msg);
	// Scroll down
	chatBox.scrollTop = chatBox.scrollHeight;
});

// Catching room info from server
socket.on("roomInfo", (roomInfo) => {
	roomName.innerText = roomInfo.room;
	printUsersList(roomInfo.users);
});

// Sending message
submitButton.addEventListener("click", (e) => {
	// Get message text
	const msg = messageInput.value.trim();
	console.log(msg);
	// If there is a message send it to the server
	if (msg) {
		socket.emit("chatMessage", msg);
		messageInput.value = "";
		messageInput.focus();
	}
});

function printUsersList(users) {
	const userNames = users.map((user) => user.username);
	if (userNames.length > 4) {
		roomUsers.innerText = userNames.slice(0, 4).join(", ") + ` and ${userNames.length - 4} others`;
	} else roomUsers.innerText = userNames.join(", ");
}

function printMessage(msg) {
	const markup = `
    <div class="msg">
        <p class="meta">
            ${msg.username}
            <span>${msg.time}</span>
        </p>
        <p class="sent-message">
            ${msg.text}
        </p>
    </div>`;
	chatBox.insertAdjacentHTML("beforeend", markup);
}
