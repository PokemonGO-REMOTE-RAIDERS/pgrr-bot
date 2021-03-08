module.exports = function expectedArguments(message, commandName, noPrefix, command, args) {
	if (!command.expectedArgs && command.args) {
		return args;
	}

	let i;
	const expectedArgs = [];
	let content = message.content;

	if(!noPrefix) {
		content = content.slice(process.env.prefix.length).trim();
	}
	content = content.replace(commandName, '').trim();

	for(i = 0; i + 1 <= command.expectedArgs; i++) {
		expectedArgs.push(args[i]);
		content = content.replace(args[i], '').trim();

		if(command.validArgs) {
			for(const validArg of command.validArgs) {
				if(validArg.name == args[i]) {
					for(const aliase of validArg.aliases) {
						content = content.replace(aliase, '').trim();
					}
				}
			}
		}
	}

	if(content) {
		expectedArgs['content'] = content;
	}

	return expectedArgs;

};