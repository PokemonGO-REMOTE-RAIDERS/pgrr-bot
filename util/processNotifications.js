module.exports = function processNotifications(client, commandNotifies, role) {

	const notifications = client.config.guild[commandNotifies];
	if(!notifications) {
		return 'No notifications configured';
	}

	let notify = '';

	if(role) {
		notify += `<@&${role.id}> `;
	}

	for(const notification of notifications) {
		if(notification) {
			notify += `<@&${notification}> `;
		}
	}

	return notify;
};