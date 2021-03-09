const getUserInfo = require('../../util/getUserInfo.js');
module.exports = {
	name: 'deletetc',
	description: 'Delete a tc that was just posted by PGRR bot',
	cooldown: 5,
	execute(message) {
		const user = message.author.id;
		getUserInfo(0, user, 'tcmessageid')
			.then((response) => {
				message.channel.messages.fetch(response)
					.then((rsp) => {
						rsp.delete();
						rsp.channel.send('Trainer Code Deleted');
					})
					.catch((error) => console.log(error));
			})
			.catch(() => {
				message.channel.send('No message found for deletion, please check to see if it has already been deleted.');
			});
	},
};
