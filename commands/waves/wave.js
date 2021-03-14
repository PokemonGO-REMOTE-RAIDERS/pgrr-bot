const getUserInfo = require('../../util/getUserInfo');
const setUserInfo = require('../../util/setUserInfo');

module.exports = {
	name: 'wave',
	description: 'Let a wave know which one is happening next.',
	expectedArgs: 1,
	cooldown: 2,
	noPrefix: true,
	execute(message, args) {
		const amount = parseInt(args[0]);
		const arg = args[0];
		const user = message.author;

		getUserInfo(0, user, 'row').then((userInfo) => {
			const thisWave = parseInt(userInfo.currentwave) + 1;

			if (isNaN(amount) && userInfo.hosting) {

				if(arg == 'failed') {
					message.channel.send(userInfo.failed);
				}

				if(arg == 'last' || arg == 'closed') {

					const endWaveData = [
						{ data: 'hosting', value: false },
						{ data: 'currentwave', value: 0 },
						{ data: 'tcmessageid', value: 0 },
					];

					message.channel.send(`**✨WAVE ${thisWave} SENDING INVITES✨**\n\n**DON’T LEAVE WHEN THE HOST DOES.**\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._`);
					message.channel.send(userInfo.last);

					if(parseInt(userInfo.maxwaves) < thisWave) {
						endWaveData[3] = { data: 'maxwaves', value: thisWave };

						message.channel.send(`Congratulations <@${user.id}>, you beat your old wave record of ${userInfo.maxwaves}.  Your new record is ${thisWave} waves!`);
					}

					if(parseInt(userInfo.tcmessageid) !== 0) {
						message.channel.messages.fetch(userInfo.tcmessageid)
							.then((rsp) => {
								rsp.delete();
								rsp.channel.send('Trainer Code Deleted');
							}).catch((error) => console.log(error));
					}

					setUserInfo(0, user, endWaveData, null).catch();

				}

				if(arg == 'next') {
					message.channel.send(`**✨WAVE ${thisWave} SENDING INVITES✨**\n\n**DON’T LEAVE WHEN THE HOST DOES.**\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._`);

					if(userInfo.hosting) {
						setUserInfo(0, user, 'currentwave', thisWave).then().catch();
					}
				}

			}
			else {
				message.channel.send(`**✨WAVE ${amount} SENDING INVITES✨**\n\n**DON’T LEAVE WHEN THE HOST DOES.**\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._`);

				if(userInfo.hosting) {
					setUserInfo(0, user, 'currentwave', thisWave).then().catch();
				}
			}
		});

	},
};