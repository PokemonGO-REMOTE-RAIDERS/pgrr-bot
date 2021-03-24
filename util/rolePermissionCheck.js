module.exports = async function rolePermissionCheck(client, message, command) {

	const allowedRoles = [];
	for(const role of command.roles) {

		const allowedRole = client.config[role];
		allowedRole.forEach(e => allowedRoles.push(e));

	}

	let response = false;
	for(const allowedRole of allowedRoles) {
		if(message.member.roles.cache.has(allowedRole)) {
			response = true;
		}
	}

	return response;

};