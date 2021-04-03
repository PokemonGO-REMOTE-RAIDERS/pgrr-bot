module.exports = function processNotifications(client, commandNotifies, role) {

	// Grab the notification settings for this command
	const notifications = client.config.guild[commandNotifies];

	// Back out if nothing is set
	if(!notifications) {
		return false;
	}

	// Establish notify string
	let notify = new String();

	// Set the role the user added.
	if(role) {
		notify += `<@&${role.id}> `;
	}

	// Set all other roles from the command
	for(const notification of notifications) {
		if(notification) {
			notify += `<@&${notification}> `;
		}
	}

	return notify;
};