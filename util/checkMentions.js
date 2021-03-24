module.exports = function checkMentions(message, args) {
	let user;
	if(args['mention']) {
		user = message.guild.members.cache.get(args['mention']);
	}
	else {
		user = message.author;
	}
	return user;
};