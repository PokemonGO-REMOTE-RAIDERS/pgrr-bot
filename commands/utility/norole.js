const noRoles = require('../../noRoles.js');
module.exports = {
	name: 'norole',
	description: 'Assign users with no role a specific role',
	expectedArgs: 0,
	config: 'wavehost',
	roles: ['roleAdmin'],
	args: false,
	execute(message, args) {
		(async function() {

			const setRole = args['role'];
			const assignedRole = message.channel.guild.roles.cache.find(role => role.id === setRole);

			if(!setRole) {
				return message.channel.send('Please select a role to assign these users to.');
			}

			if(!assignedRole) {
				return message.channel.send('Can\'t find this role, please try again.');
			}

			const noroles = noRoles();
			// TESTING
			/*
			const noroles = [
				'298814297709215744',
				'398273755371143188',
				'154543392955695104',
				'482245793865138179',
				'157161448701689856',
				'310756994044657674',
			];
			*/

			message.guild.members.fetch({ user: noroles, force: true }).then(members => {

				message.channel.send(`Members Found: ${members.size}.`);

				let i = 0;
				members.forEach(member => {
					console.log(member.user.username);
					member.roles.add(assignedRole);
					i++;
				});

				message.channel.send(`Added ${assignedRole.name} to ${i} members.`);

			}).catch(error => console.log(error));


		}());

	},
};