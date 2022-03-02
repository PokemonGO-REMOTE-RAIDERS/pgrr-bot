const getUserInfo = require('../../util/getUserInfo');
const setUserInfo = require('../../util/setUserInfo');
const checkChannel = require('../../util/checkChannels');
const ms = require('ms');

function waveMessage(wave, userInfo, client) {

	wave = wave ? wave : '';

	const embed = {
		color: client.config.guild.embedColor,
		title: `**✨WAVE ${wave} SENDING INVITES!✨**`,
		description: '**DON’T LEAVE WHEN THE HOST DOES**\n\n_Leave only at 10 seconds if you have less trainers than is recommended._',
		author: {
			name: client.config.guild.botName,
			icon_url: client.config.guild.botIcon,
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
	config: 'wavehost',
	expectedArgs: 1,
	cooldown: 2,
	noPrefix: true,
	roles: ['roleVerified'],
	execute(message, args, client) {
		(async function() {
			const wave = args[0];
			const user = message.author;
			const channels = ['sponsoredChannels'];
			const userInfo = await getUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'row');

			const isSponsoredChannel = checkChannel(client, message, channels);

			// We're not in a sponsored channel, send away.
			if(!isSponsoredChannel) {
				console.log(`${user.username}: Not a sponsored channel, good to go.`);
				return message.channel.send({ embed: waveMessage(wave, userInfo, client) });
			}

			// We are in a sponsored channel.
			if(!userInfo) {
				console.log(`${user.username}: In a sponsored channel, but not a verified host.`);
				return;
			}

			if(userInfo.hosting == 'FALSE' || userInfo.hosting == false) {
				console.log(`${user.username}: Verified host, but not currently hosting.`);
				return;
			}

			if(userInfo.channelid !== message.channel.id) {
				console.log(`${user.username}: Hosting, but not waving in the correct channel.`);
				return;
			}

			// User is hosting AND the channel id's match
			// One last check for good measure.
			if((userInfo.hosting == 'TRUE' || userInfo.host == true) && userInfo.channelid == message.channel.id) {

				// console.log(`${user.username}: Verified user, and in the correct channel.`);

				const now = new Date();
				const duration = now - Date.parse(userInfo.starttime);
				const thisWave = parseInt(userInfo.currentwave) + 1;
				const tcmessageid = userInfo.tcmessageid ? userInfo.tcmessageid : false;

				const starttime = new Date(userInfo.starttime).toLocaleDateString('en-us');

				const resetWaveData = [
					{ data: 'hosting', 		value: false },
					{ data: 'currentwave', 	value: 0 },
					{ data: 'fails',		value: 0 },
					{ data: 'notifications',	value: 0 },
					{ data: 'strings',		value: 0 },
					{ data: 'tcmessageid', 	value: '' },
					{ data: 'starttime',	value: '' },
					{ data: 'waveid',		value: '' },
					{ data: 'boss',		value: '' },
					{ data: 'bossid',		value: '' },
					{ data: 'hosts', 		value: parseInt(userInfo.hosts) + 1 },
					{ data: 'channelname', 	value: '' },
					{ data: 'channelid', 	value: '' },
				];


				// Log all data to WaveHistory
				const history = {
					waveid: 		userInfo.waveid,
					userid: 		userInfo.userid,
					ign: 		userInfo.ign,
					date: 		starttime,
					duration:		ms(duration, { long: true }),
					channel:		message.channel.id,
					boss:		userInfo.boss ? userInfo.boss : 'Not Set',
					waves:		userInfo.currentwave,
					fails:		userInfo.fails,
					notifications: userInfo.notifications,
					channelname: 	userInfo.channelname,
					channelid: 	userInfo.channelid,
					strings: 		userInfo.strings,
				};

				switch(wave) {

				case 'fail':
				case 'fails':
				case 'failed':
					message.channel.send(userInfo.failed ? userInfo.failed : 'Wave Failed');
					if(userInfo.failtc == 'TRUE' && userInfo.failtc !== 'FALSE') {
						message.channel.send(userInfo.tc).then((sent) => {

							setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'fails', parseInt(userInfo.fails) + 1);

							setTimeout(() => sent.delete(), 10000);

						});
					}
					break;

				case 'last':
				case 'final':
					message.channel.send({ embed: waveMessage(thisWave, userInfo, client) });
					message.channel.send(userInfo.last);
					setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'currentwave', thisWave).then(() => {

						// Delete Trainer Code if it's still there.
						if(tcmessageid) {
							message.channel.messages.fetch(tcmessageid)
								.then((tcmessage) => {
									tcmessage.delete();
									tcmessage.channel.send('Trainer Code Deleted');

									setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'tcmessageid', '', false).catch();

								}).catch((error) => console.log(error));
						}

					}).catch();
					break;


				case 'close':
				case 'closed':
				case 'end':


					// Save all data to History
					setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHistory, user, history, null, true).then(() => {

						// Reset wavehost sheet
						setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, resetWaveData, null).catch();

					}).catch();


					// Send Wave Record if reached
					if(parseInt(userInfo.maxwaves) < userInfo.currentwave) {

						resetWaveData.push({ data: 'maxwaves', value: userInfo.currentwave });
						message.channel.send({ embed: {
							color: client.config.guild.embedColor,
							title: `<a:AnimatedPartyPopperBadge:745495016067301547> <a:AnimatedPartyPopperBadge:745495016067301547> Congratulations ${userInfo.ign}, you set a personal best! <a:AnimatedPartyPopperBadge:745495016067301547> <a:AnimatedPartyPopperBadge:745495016067301547>`,
							author: {
								name: client.config.guild.botName,
								icon_url: client.config.guild.botIcon,
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
						color: client.config.guild.embedColor,
						title: 'WAVE HOST HAS BEEN CLOSED!',
						description: userInfo.closed,
						timestamp: now,
						author: {
							name: client.config.guild.botName,
							icon_url: client.config.guild.botIcon,
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
					} });

					// Delete Trainer Code if it's still there.
					if(tcmessageid) {
						message.channel.messages.fetch(tcmessageid)
							.then((tcmessage) => {
								tcmessage.delete();
								tcmessage.channel.send('Trainer Code Deleted');
							}).catch((error) => console.log(error));
					}

					break;

				case 'next':
					message.channel.send({ embed: waveMessage(thisWave, userInfo, client) });
					setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
					break;

				default:
					message.channel.send({ embed: waveMessage(thisWave, userInfo, client) });
					setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
					break;

				}
			}


		}().catch(function(error) { console.error(error); }));

	},
};