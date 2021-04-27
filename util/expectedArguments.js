/**
 *
 * This function and validateArguments do similar but different jobs.
 * I'm considering refactoring them into one function at some point, but for now, they'll stay this way until I have some time to rethink it.
 *
 * @param {*} message Include the message
 * @param {*} commandName Name of the command
 * @param {*} noPrefix Do we need to worry about a prefix?
 * @param {*} command the command object
 * @param {*} args the array of args from the message
 * @param {*} client the client information
 * @returns
 */


module.exports = function expectedArguments(message, commandName, noPrefix, command, args, client) {

	// If the command doesn't have a set amount of args it's expecting then return what was passed.
	if (!command.expectedArgs && command.args) {
		return args;
	}

	let i;
	const expectedArgs = new Array();
	let content = message.content;
	// let mention = '';

	// If this is a prefixed command, slice off the first char
	if(!noPrefix) {
		content = content.slice(client.prefix.length).trim();
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

	// Add content to the args array.
	if(content) {
		expectedArgs['content'] = content;
	}


	// loop through args
	for(const arg of args) {
		const currentArg = String(arg);

		// Pull out any IDs that are set.
		if (currentArg.startsWith('<@') && currentArg.endsWith('>')) {

			// A user was mentioned
			let mention = currentArg.slice(2, -1);

			// A user with a nickname was mentioned
			if (mention.startsWith('!')) {
				mention = mention.slice(1);
			}

			// set the mention to the arg array
			expectedArgs['mention'] = mention;


			// A role was mentioned
			if (mention.startsWith('&')) {
				mention = mention.slice(1);
				expectedArgs['role'] = mention;
			}
		}
	}

	return expectedArgs;

};