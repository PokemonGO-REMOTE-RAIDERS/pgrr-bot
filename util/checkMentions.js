module.exports = function checkMentions(message, args) {

	let user;
	// If the command has a mention in the args set it.
	if(args['mention']) {
		user = message.guild.members.cache.get(args['mention']);
	}

	// Otherwise use the user that sent the messsage.
	else {
		user = message.author;
	}

	
	return user;
};