const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
module.exports = {
	name: 'deletetc',
	aliases: [ 'delete', 'tc', 'trainercode'],
	description: 'Delete a tc that was just posted by PGRR bot',
	config: 'wavehost',
	cooldown: 5,
	roles: ['roleWaveHost'],
	execute(message) {
		const user = message.author;
		getUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'tcmessageid')
			.then((response) => {
				message.channel.messages.fetch(response)
					.then((rsp) => {
						rsp.delete();
						rsp.channel.send('Trainer Code Deleted');

						setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'tcmessageid', 0, false).catch();

					})
					.catch((error) => console.log(error));
			})
			.catch(() => {
				message.channel.send('No message found for deletion, please check to see if it has already been deleted.');
			});
	},
};
