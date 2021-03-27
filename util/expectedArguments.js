module.exports = function expectedArguments(message, commandName, noPrefix, command, args, client) {

	// If the command doesn't have a set amount of args it's expecting then return what was passed.
	if (!command.expectedArgs && command.args) {
		return args;
	}

	let i;
	const expectedArgs = [];
	let content = message.content;
	let mention = '';

	// If this is a prefixed command, slice off the first char
	if(!noPrefix) {
		content = content.slice(client.config.guild.prefix.length).trim();
	}

	// Remove the command name from the content
	content = content.slice(String(commandName).length).trim();

	// Loop through for the amount of expected args.
	for(i = 0; i + 1 <= command.expectedArgs; i++) {

		const currentArg = String(args[i]);

		// push an arg if it is expected.
		expectedArgs.push(args[i]);

		content = content.slice(currentArg.length).trim();
	}

	if(content) {
		expectedArgs['content'] = content;
	}

	for(const arg of args) {
		const currentArg = String(arg);

		if (currentArg.startsWith('<@') && currentArg.endsWith('>')) {
			mention = currentArg.slice(2, -1);
			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}
			expectedArgs['mention'] = mention;

			if (mention.startsWith('&')) {
				mention = mention.slice(1);
				expectedArgs['role'] = mention;
			}
		}
	}

	// console.log(expectedArgs);
	return expectedArgs;

};