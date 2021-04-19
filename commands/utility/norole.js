const noRoles = require('../../noRoles.js');
const secondsToHms = require('../../util/secondsToHms.js');

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

			const timeToComplete = secondsToHms(noroles.length + 5);

			message.channel.send(`ETA: ${timeToComplete}`);

			let i = 0;
			noroles.forEach(id => {

				setTimeout(() => {
					const member = message.channel.guild.members.cache.get(id);

					if(member && !member.roles.cache.some(role => role.id === assignedRole.id)) {
						member.roles.add(assignedRole);
						i++;
					}
				}, 1000);

			});

			const awaitCompletion = Math.floor((noroles.length + 5) * 1000);

			setTimeout(() => {
				message.channel.send(`Added **${assignedRole.name}** to ${i} members.`);
			}, awaitCompletion);

		}());

	},
};