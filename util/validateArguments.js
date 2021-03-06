/**
 *
 * This function and expectedArguments do similar but different jobs.
 * I'm considering refactoring them into one function at some point, but for now, they'll stay this way until I have some time to rethink it.
 *
 * @param {*} message The message object
 * @param {*} command The command object
 * @param {*} args The args array
 * @param {*} client the client object
 * @returns array
 */
module.exports = function validateArguments(message, command, args, client) {

	// If this command doesn't have valid args, just return the args that were passed
	if(!command.validArgs) {
		return args;
	}

	const validArgs = new Array();

	// loop through the args sent by user
	for(const arg of args) {

		// loop through the valid args for the command
		for(const varg of command.validArgs) {

			// if the aliases exist or the arg is being used continue
			if(varg.aliases.includes(arg) || varg.name == arg) {

				// push the actual arg name to the array of args.
				validArgs.push(varg.name);
			}
		}
	}

	// if no valid args are found send a reply to the user.
	if (validArgs === undefined || validArgs.length == 0) {

		const reply = `The argument(s) you used are invalid, type \`${client.config.guild.prefix}help\` for more information.`;
		message.channel.send(reply);
		return false;
	}

	// If there is a content arg, push it.
	if(args['content']) {
		validArgs['content'] = args['content'];
	}

	if(args['mention']) {
		validArgs['mention'] = args['mention'];
	}
	if(args['role']) {
		validArgs['role'] = args['role'];
	}

	// Return an array of valid args.
	return validArgs;

};