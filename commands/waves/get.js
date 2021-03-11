const getUserInfo = require('../../util/getUserInfo.js');
const ms = require('ms');
module.exports = {
	name: 'get',
	description: 'Get information about a wavehost. Only accessible by the actual wavehost.',
	args: true,
	expectedArgs: 1,
	cooldown: 5,
	validArgs: [
		{
			name: 'ign',
			aliases: ['name', 'trainername'],
		},
		{
			name: 'userid',
			aliases: ['id', 'user'],
		},
		{
			name: 'tc',
			aliases: ['trainercode', 'code', 'trainer'],
		},
		{
			name: 'location',
			aliases: ['state', 'country', 'area'],
		},
		{
			name: 'maxwaves',
			aliases: ['waves', 'total', 'score'],
		},
		{
			name: 'hosts',
			aliases: ['maxhosts', 'hosttimes', 'timeshosted'],
		},
		{
			name: 'timer',
			aliases: ['deletetimer'],
		},
		{
			name: 'rules',
			aliases: ['rule'],
		},
	],
	execute(message, args) {
		const data = args[0];
		const user = message.author;
		getUserInfo(0, user, data)
			.then((response) => {
				if(data == 'timer') {
					response = ms(response);
				}
				message.channel.send(response);
			})
			.catch((error) => {
				console.log(error, `userid: ${user}`);
				message.channel.send(`No data found for this user. Maybe consider using \`${process.env.prefix}set\` and add yourself!`);
			});
	},
};
