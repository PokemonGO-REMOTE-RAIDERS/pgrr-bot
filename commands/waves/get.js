const getUserInfo = require('../../util/getUserInfo.js');
const checkMentions = require('../../util/checkMentions.js');
const ms = require('ms');
module.exports = {
	name: 'get',
	description: 'Get information about a wavehost. Only accessible by the actual wavehost.',
	args: true,
	expectedArgs: 2,
	roles: ['roleWaveHost', 'roleAdmin'],
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
		{
			name: 'failed',
			aliases: ['fail', 'fails'],
		},
		{
			name: 'failtc',
			aliases: ['failedtc', 'tcfail', 'trainercodefail', 'showtc'],
		},
		{
			name: 'closed',
			aliases: ['close', 'closing'],
		},
		{
			name: 'last',
			aliases: ['lasts'],
		},
	],
	execute(message, args) {
		const data = args[0];
		const user = checkMentions(message, args);

		getUserInfo(process.env.sheetWaveHosts, user, data)
			.then((response) => {
				if(response) {
					if(data == 'timer') {
						response = ms(response);
					}
					message.channel.send(response);
				}
				else {
					message.channel.send(`No information found, consider starting a wavehost profile by using use \`${process.env.prefix}set tc\` and set your trainer code.`);
				}
			})
			.catch((error) => {
				console.log(error, `userid: ${user}`);
				message.channel.send(`No data found for this user. Maybe consider using \`${process.env.prefix}set\` and add yourself!`);
			});
	},
};
