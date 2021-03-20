const getUserInfo = require('../../util/getUserInfo');
const setUserInfo = require('../../util/setUserInfo');

function waveMessage(wave) {
	return `**✨WAVE ${wave} SENDING INVITES✨**\n\n**DON’T LEAVE WHEN THE HOST DOES.**\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._`;
}

module.exports = {
	name: 'wave',
	description: 'Let a wave know which one is happening next.',
	expectedArgs: 1,
	cooldown: 2,
	noPrefix: true,
	execute(message, args) {
		(async function() {

			const wave = args[0];
			const user = message.author;
			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, 'row');

			if(!userInfo) {
				return message.channel.send(waveMessage(wave));
			}
			else if(!userInfo.hosting) {
				return message.channel.send(waveMessage(wave));
			}

			// Set the wave that's being set.
			const thisWave = parseInt(userInfo.currentwave) + 1;
			const resetWaveData = [
				{ data: 'hosting', 		value: false },
				{ data: 'currentwave', 	value: 0 },
				{ data: 'fails',		value: 0 },
				{ data: 'tcmessageid', 	value: '' },
				{ data: 'starttime',	value: '' },
				{ data: 'waveid',		value: '' },
				{ data: 'hosts', 		value: parseInt(userInfo.hosts) + 1 },
			];

			// Log all data to WaveHistory
			const history = {
				waveid: 		userInfo.waveid,
				userid: 		userInfo.userid,
				ign: 		userInfo.ign,
				starttime: 	userInfo.starttime,
				endtime:		new Date(),
				channel:		message.channel.id,
				boss:		'N/A Yet',
				waves:		userInfo.currentwave,
				fails:		userInfo.fails,
			};

			switch(wave) {

			case 'fail':
			case 'fails':
			case 'failed':
				message.channel.send(userInfo.failed);
				message.channel.send(userInfo.tc).then((sent) => {

					setUserInfo(process.env.sheetWaveHosts, user, 'fails', parseInt(userInfo.fails) + 1);

					setTimeout(() => sent.delete(), 10000);

				});
				break;


			case 'next':
				message.channel.send(waveMessage(thisWave));
				setUserInfo(process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
				break;


			case 'last':
				message.channel.send(waveMessage(thisWave));
				message.channel.send(userInfo.last);
				setUserInfo(process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
				break;


			case 'closed':
			case 'end':
				if(parseInt(userInfo.maxwaves) < userInfo.currentwave) {
					resetWaveData.push({ data: 'maxwaves', value: userInfo.currentwave });
					message.channel.send(`Congratulations <@${user.id}>, you beat your old wave record of ${userInfo.maxwaves}.  Your new record is ${userInfo.currentwave} waves!`);
				}

				setUserInfo(process.env.sheetWaveHistory, user, history, null, true).then(() => {
					setUserInfo(process.env.sheetWaveHosts, user, resetWaveData, null).catch();
				}).catch();

				if(userInfo.tcmessageid) {
					message.channel.messages.fetch(userInfo.tcmessageid)
						.then((tcmessage) => {
							tcmessage.delete();
							tcmessage.channel.send('Trainer Code Deleted');
						}).catch((error) => console.log(error));
				}

				break;

			default:
				message.channel.send(waveMessage(wave));
				setUserInfo(process.env.sheetWaveHosts, user, 'currentwave', thisWave).catch();
				break;

			}


		}());

	},
};