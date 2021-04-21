const noRoles = require('../../noRoles.js');
const chunkArray = require('../../util/chunkArray.js');
const secondsToHms = require('../../util/secondsToHms.js');
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
			const off = true;

			if(off) {
				return message.channel.send('Contact <@310756994044657674> for help with this.');
			}

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


			const chunkSize = !isNaN(args[0]) ? parseInt(args[0]) : 50;
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

				const cleanArray = new Array();
				userCollection.forEach(chunk => {
					chunk.forEach(member => {
						cleanArray.push(member);
					});
				});
				console.log(cleanArray.length);

				const eta = secondsToHms(cleanArray.length);
				message.channel.send(`Adding ${assignedRole.name} to ${cleanArray.length} members, ETA ${eta}.`);

				let i = 0;
				const processRoles = async () => {
					for(const member of cleanArray) {
						await new Promise(r => setTimeout(r, 1000));
						console.log(member.user.username);
						member.roles.add(assignedRole);
						i++;
					}
				};

				processRoles().then(() => {
					message.channel.send(`Added ${assignedRole.name} to ${i} members.`);
				});

			});


		}());

	},
};