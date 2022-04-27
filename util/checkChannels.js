module.exports = function checkChannel(client, message, channels) {
	// Establish the allowed channels array
	const allowedChannels = new Array();

	// Loop through all of the channels allowed by the command
	channels.forEach((channel) => {
		// Grab the config values (should be an array of channel IDs set in Google Sheets)
		const allowedChannel = client.config.guild[channel];

		// Push all of them allowedRoles
		allowedChannel.forEach((e) => allowedChannels.push(e));
	});

	let response = false;

	// Loop through all Role IDs and check to see if the user is assigned to any of them
	allowedChannels.forEach((allowedChannel) => {
		if (message.channel.id == allowedChannel) {
			response = true;
		}
	});

	return response;
};
