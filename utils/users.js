const users = [];

// Join user to the chat
function userJoin(id, username, room) {
	const user = { id, username, room };
	users.push(user);
	return user;
}

// User left the chat
function userLeave(id) {
	const index = users.findIndex((user) => user.id === id);
	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

function getCurrentUser(id) {
	return users.find((user) => user.id === id);
}

function getRoomUsers(room) {
	return users.filter((user) => user.room === room);
}

module.exports = {
	userJoin,
	userLeave,
	getCurrentUser,
	getRoomUsers,
};
