const ms = require('ms');
/**
 * 
 * @param {*} cooldowns The collection of cooldowns
 * @param {*} command The command object
 * @param {*} message The message object
 * @param {*} Discord
 * @returns message
 */
module.exports = function cooldown(cooldowns, command, message, Discord) {
	
	// If the command is not already set in the cooldowns collection, set it. 
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	// Current datetime
	const now = Date.now();

	// Get timestamps object based on the command name
	const timestamps = cooldowns.get(command.name);

	// Convert cooldown time to milliseconds or default it to 3 seconds
	const cooldownAmount = (command.cooldown || 3) * 1000;

	// If the userid is set in the timestamp continue
	if (timestamps.has(message.author.id)) {

		// The time the cooldown expires
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		// If it hasn't been longer than the expiration time, throw a warning in channel
		if (now < expirationTime) {
			
			const timeLeft = ms(expirationTime - now);
			message.reply(`please wait ${timeLeft} before reusing the \`${command.name}\` command.`);

			return true;
		}
	}

	// Set the initial cooldown time
	timestamps.set(message.author.id, now);

	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
};