module.exports = async function checkRoles(client, message, command) {

	// Establish the allowed Roles array
	const allowedRoles = new Array();

	// Loop through all of the roles allowed by the command
	command.roles.forEach(role => {

		// Grab the config values (should be an array of role IDs set in Google Sheets)
		const allowedRole = client.config.guild[role];

		// Push all of them allowedRoles
		allowedRole.forEach(e => allowedRoles.push(e));

	});

	let response = false;

	// Loop through all Role IDs and check to see if the user is assigned to any of them
	allowedRoles.forEach(allowedRole => {
		if(message.member.roles.cache.has(allowedRole)) {
			response = true;
		}
	});

	return response;

};