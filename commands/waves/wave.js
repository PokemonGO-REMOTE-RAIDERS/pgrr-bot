const getUserInfo = require('../../util/getUserInfo');
const setUserInfo = require('../../util/setUserInfo');
const ms = require('ms');

function waveMessage(wave, userInfo, client) {
	const embed = {
		color: client.config.embedColor,
		title: `**✨Wave ${wave} SENDING INVITES!✨**`,
		description: 'DON’T LEAVE WHEN THE HOST DOES\n\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._',
		author: {
			name: client.config.botName,
			icon_url: client.config.botIcon,
		},
		timestamp: new Date(),
	};

	if(userInfo) {
		embed['footer'] = { text: `Invite coming from ${userInfo.ign}` };
	}

	return embed;
}

module.exports = {
	name: 'wave',
	description: 'Let a wave know which one is happening next.',
	expectedArgs: 1,
	cooldown: 2,
	noPrefix: true,
	execute(message, args, client) {
		(async function() {

			const wave = args[0];
			const user = message.author;
			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, 'row');

			if(!userInfo) {
				return message.channel.send({ embed: waveMessage(wave, userInfo, client) });
			}
			else if(!userInfo.hosting) {
				return message.channel.send({ embed: waveMessage(wave, userInfo, client) });
			}

			const now = new Date();
			const duration = now - Date.parse(userInfo.starttime);
			const thisWave = parseInt(userInfo.currentwave) + 1;

			const resetWaveData = [
				{ data: 'hosting', 		value: false },
				{ data: 'currentwave', 	value: 0 },
				{ data: 'fails',		value: 0 },
				{ data: 'notifications',	value: 0 },
				{ data: 'tcmessageid', 	value: '' },
				{ data: 'starttime',	value: '' },
				{ data: 'waveid',		value: '' },
				{ data: 'boss',		value: '' },
				{ data: 'bossid',		value: '' },
				{ data: 'hosts', 		value: parseInt(userInfo.hosts) + 1 },
			];


			// Log all data to WaveHistory
			const history = {
				waveid: 		userInfo.waveid,
				userid: 		userInfo.userid,
				ign: 		userInfo.ign,
				starttime: 	userInfo.starttime,
				endtime:		now,
				duration:		ms(duration, { long: true }),
				channel:		message.channel.id,
				boss:		userInfo.boss,
				waves:		userInfo.currentwave,
				fails:		userInfo.fails,
				notifications: userInfo.notifications,
			};

			switch(wave) {

			case 'fail':
			case 'fails':
			case 'failed':
				message.channel.send(userInfo.failed ? userInfo.failed : 'Wave Failed');
				console.log(userInfo.failtc);
				if(userInfo.failtc == 'TRUE' && userInfo.failtc !== 'FALSE') {
					message.channel.send(userInfo.tc).then((sent) => {

						setUserInfo(process.env.sheetWaveHosts, user, 'fails', parseInt(userInfo.fails) + 1);

						setTimeout(() => sent.delete(), 10000);

					});
				}
				break;

			case 'last':
			case 'final':
				message.channel.send({ embed: waveMessage(thisWave, userInfo, client) });
				message.channel.send(userInfo.last);
				setUserInfo(process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
				break;


			case 'close':
			case 'closed':
			case 'end':

				// Send Wave Record if reached
				if(parseInt(userInfo.maxwaves) < userInfo.currentwave) {
					resetWaveData.push({ data: 'maxwaves', value: userInfo.currentwave });
					message.channel.send({ embed: {
						color: client.config.embedColor,
						title: `Congratulations ${userInfo.ign}, you set a personal best!`,
						author: {
							name: client.config.botName,
							icon_url: client.config.botIcon,
						},
						fields: [
							{
								name: 'Previous Record',
								value: userInfo.maxwaves,
								inline: true,
							},
							{
								name: 'New Record',
								value: userInfo.currentwave,
								inline: true,
							},
						],
						timestamp: now,
					} });
				}


				// Send Wave Summary
				message.channel.send({ embed: {
					color: client.config.embedColor,
					title: 'WAVE HOST HAS BEEN CLOSED!',
					description: userInfo.closed,
					author: {
						name: client.config.botName,
						icon_url: client.config.botIcon,
					},
					fields: [
						{
							name: 'Host Duration',
							value: history.duration,
							inline: true,
						},
						{
							name: 'Boss',
							value: history.boss,
							inline: true,
						},
						{
							name: 'Host #',
							value: parseInt(userInfo.hosts) + 1,
							inline: true,
						},
						{
							name: 'Completed Waves',
							value: history.waves,
							inline: true,
						},
						{
							name: 'Waves Failed',
							value: history.fails,
							inline: true,
						},
						{
							name: 'Notifications',
							value: history.notifications,
							inline: true,
						},
					],
					timestamp: now,
					// footer: {
					// 	text: 'If you have questions, please tag @manager',
					// },
				},
				});

				// Delete Trainer Code if it's still there.
				if(userInfo.tcmessageid) {
					message.channel.messages.fetch(userInfo.tcmessageid)
						.then((tcmessage) => {
							tcmessage.delete();
							tcmessage.channel.send('Trainer Code Deleted');
						}).catch((error) => console.log(error));
				}

				// Save all data to History
				setUserInfo(process.env.sheetWaveHistory, user, history, null, true).then(() => {

					// Reset wavehost sheet
					setUserInfo(process.env.sheetWaveHosts, user, resetWaveData, null).catch();

				}).catch();

				break;

			case 'next':
				message.channel.send({ embed: waveMessage(thisWave, userInfo, client) });
				setUserInfo(process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
				break;

			default:
				message.channel.send({ embed: waveMessage(thisWave, userInfo, client) });
				setUserInfo(process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
				break;

			}


		}());

	},
};