const noRoles = require('../../noRoles.js');
const chunkArray = require('../../util/chunkArray.js');
module.exports = {
	name: 'norole',
	description: 'Assign users with no role a specific role',
	expectedArgs: 1,
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

			const chunkSize = !isNaN(args[0]) ? parseInt(args[0]) : 3;
			const chunkedRoles = chunkArray(noroles, chunkSize);

			let sequences = Promise.resolve();

			const userCollection = new Array();

			chunkedRoles.forEach(users => {
				sequences = sequences.then(() => {

					return new Promise((resolve, reject) => {
						message.guild.members.fetch({ user: users, force: true }).then(members => {

							userCollection.push(members);
							message.channel.send(`Found ${members.size} users.`);
							resolve(members);

						}).catch(error => {
							console.log(error);
							reject(error);
							message.channel.send('TIME OUT ERROR');
						});
					});
				});
			});

			sequences.then(members => {
				message.channel.send(`Adding ${assignedRole.name} to found users.`);
				let i = 0;
				userCollection.forEach(chunk => {
					chunk.forEach(member => {
						console.log(member.user.username);
						member.roles.add(assignedRole);
						i++;
					});
				});

				message.channel.send(`Added ${assignedRole.name} to ${i} members.`);
			});


		}());

	},
};