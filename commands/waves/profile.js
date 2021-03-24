const getUserInfo = require('../../util/getUserInfo.js');
const checkMentions = require('../../util/checkMentions.js');
// const getHistoricalWaves = require('../../util/getHistoricalWaves.js');
// const ms = require('ms');
module.exports = {
	name: 'profile',
	description: 'Get historical information about a wavehost.',
	aliases: ['wavehost', 'waveprofile'],
	// args: true,
	roles: ['rolewavehost', 'roleadmin'],
	cooldown: 5,
	expectedArgs: 1,
	validArgs: [
		{
			name: 'stats',
			aliases: ['stat', 'statistics'],
		},
		{
			name: 'settings',
			aliases: ['setting'],
		},
	],
	execute(message, args) {
		(async function() {
			const filter = args[0];
			const user = checkMentions(message, args);

			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, 'row');
			// const wavehistory = await getHistoricalWaves(user);

			if(!userInfo) {
				message.channel.send(`Sorry <@${user.id}>, no information was found for you.`);
				return;
			}

			const embed = {
				color: process.env.color,
				author: {
					name: process.env.botname,
					icon_url: process.env.boticon,
				},
				title: `WaveHost Profile: ${user.username}`,
			};

			if(filter == 'stats') {
				embed['fields'] = [
					{
						name: 'Total Hosts',
						value: userInfo.hosts,
						inline: true,
					},
					{
						name: 'Wave Record',
						value: userInfo.maxwaves,
						inline: true,
					},
					{
						name: 'Host\'s This Week',
						value: 'Coming Soon',
						inline: true,
					},
					{
						name: 'Host\'s This Month',
						value: 'Coming Soon',
						inline: true,
					},
				];
			}

			if(filter == 'settings') {
				embed['fields'] = [
					{
						name: 'In Game Name `ign`',
						value: userInfo.ign,
						inline: true,
					},
					{
						name: 'trainer code `tc`',
						value: userInfo.tc,
						inline: true,
					},
					{
						name: 'Location `location`',
						value: userInfo.location,
						inline: true,
					},
					{
						name: 'Show Trainer Code of Failed Wave `failtc`',
						value: userInfo.failtc,
						inline: true,
					},
					{
						name: 'Rules `rules`',
						value: userInfo.rules,
						inline: false,
					},
					{
						name: 'Failed Message `failed`',
						value: userInfo.failed,
						inline: false,
					},
					{
						name: 'Wave Closed Message `closed`',
						value: userInfo.closed,
						inline: false,
					},
					{
						name: 'Last Wave Message `last`',
						value: userInfo.last,
						inline: false,
					},
				];
			}

			message.channel.send({ embed: embed });
			// console.log(userInfo);
			// console.log(wavehistory);
		}());
	},
};
