module.exports = function validateArguments(message, command, args) {
	if(!command.validArgs) {
		return args;
	}

	const validArgs = [];
	for(const arg of args) {
		for(const varg of command.validArgs) {
			if(varg.aliases.includes(arg) || varg.name == arg) {
				validArgs.push(varg.name);
			}
		}
	}
	if (validArgs === undefined || validArgs.length == 0) {
		const reply = `The argument(s) you used are invalid, type \`${process.env.prefix}help\` for more information.`;
		message.channel.send(reply);
		return false;
	}

	return validArgs;

};