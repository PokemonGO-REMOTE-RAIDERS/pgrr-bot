const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
const processNotifications = require('../../util/processNotifications.js');
module.exports = {
	name: 'host',
	description: 'Post a host\'s card',
	expectedArgs: 0,
	// cooldown: 600,
	roles: ['roleWaveHost', 'roleAdmin'],
	args: false,
	execute(message, args, client) {

		(async function() {
			const data = 'row';
			const user = message.author;
			const role = message.guild.roles.cache.get(args['role']);

			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, data).catch();

			if(!userInfo || !userInfo.tc || !userInfo.ign) {
				return message.reply('Please set a WaveHost profile.  You can start with set ign');
			}

			const embed = {
				color: client.config.guild.embedColor,
				title: `New wave with ${userInfo.ign}!`,
				description: 'It\'s time to ride the wave!',
				author: {
					name: 'PokémonGO Remote Raiders',
					icon_url: 'https://raw.githubusercontent.com/PokemonGO-REMOTE-RAIDERS/pgrr-triple-threat/main/assets/pgrr-logo.png',
				},
				fields: [
					{
						name: 'IGN',
						value: userInfo.ign,
						inline: true,
					},
					{
						name: 'Location',
						value: userInfo.location ? userInfo.location : 'Not set',
						inline: true,
					},
					{
						name: 'Boss',
						value: role ? role.name : 'Not set',
						inline: true,
					},
					{
						name: 'Number of Hosts',
						value: userInfo.hosts,
						inline: true,
					},
					{
						name: 'Wave Record',
						value: userInfo.maxwaves,
						inline: true,
					},
					{
						name: 'Rules',
						value: userInfo.rules ? userInfo.rules : 'Not set',
						inline: false,
					},
				],
				timestamp: new Date(),
				footer: {
					text: 'If you have questions, please tag @manager',
				},
			};

			const notify = processNotifications(client, 'wbNotifications', role);

			message.channel.send(notify);

			message.channel.send({ embed: embed });

			message.channel.send(userInfo.tc).then((sent) => {

				const startWaveData = [
					{ data: 'tcmessageid', 	value: sent.id },
					{ data: 'hosting', 		value: true },
					{ data: 'fails', 		value: parseInt(0) },
					{ data: 'currentwave', 	value: parseInt(0) },
					{ data: 'waveid', 		value: sent.id },
					{ data: 'starttime', 	value: new Date() },
				];

				if(role) {
					startWaveData.push({ data: 'boss', value: role.name });
					startWaveData.push({ data: 'bossid', value: role.id });
				}

				setUserInfo(process.env.sheetWaveHosts, user, startWaveData, null).catch();

				if(userInfo.timer > 0) {
					setTimeout(() => {
						sent.delete();
						setUserInfo(process.env.sheetWaveHosts, user, 'tcmessageid', '').catch();
					}, userInfo.timer);
				}
			});

		}());

	},
};