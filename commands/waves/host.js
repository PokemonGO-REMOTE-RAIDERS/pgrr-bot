const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
module.exports = {
	name: 'host',
	description: 'Post a host\'s card',
	expectedArgs: 0,
	cooldown: 600,
	roles: ['rolewavehost'],
	args: false,
	execute(message) {
		(async function() {
			const data = 'row';
			const user = message.author;
			const userInfo = await getUserInfo(process.env.sheetIndexWaveHosts, user, data);

			if(!userInfo || !userInfo.tc || !userInfo.ign) {
				return message.reply('Please set a WaveHost profile.  You can start with set ign');
			}

			const embed = {
				color: '#f1609f',
				title: `Wavehost: ${userInfo.ign}`,
				description: `<@&818325677492797460> Hop on board and ride the wave with ${userInfo.ign}`,
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

			message.channel.send({ embed: embed });

			message.channel.send(userInfo.tc).then((sent) => {

				const userInfos = [
					{ data: 'tcmessageid', value: sent.id },
					{ data: 'hosting', value: true },
					{ data: 'hosts', value: parseInt(userInfo.hosts) + 1 },
					{ data: 'currentwave', value: parseInt(0) },
				];

				setUserInfo(process.env.sheetIndexWaveHosts, user, userInfos, null);

				function deleteMsg() {
					sent.delete();
				}

				if(userInfo.timer > 0) {
					setTimeout(deleteMsg, userInfo.timer);
				}
			});

		}());

	},
};