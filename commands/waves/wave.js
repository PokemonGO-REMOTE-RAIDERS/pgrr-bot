const getUserInfo = require('../../util/getUserInfo');
const setUserInfo = require('../../util/setUserInfo');

module.exports = {
	name: 'wave',
	description: 'Let a wave know which one is happening next.',
	expectedArgs: 1,
	cooldown: 10,
	noPrefix: true,
	execute(message, args) {
		const amount = parseInt(args[0]);
		const arg = args[0];

		getUserInfo(0, message.channel.author.id, 'row').then((userInfo) => {
			if (isNaN(amount)) {
				if(arg == 'failed') {
					message.channel.send(userInfo.failed);
				}

				if(arg == 'closed') {

					message.channel.send(userInfo.closed);

				}

				if(arg == 'last') {
					message.channel.send(userInfo.last);
				}

			}
			else {
				message.channel.send(`**✨WAVE ${amount} SENDING INVITES✨**\n\n**DON’T LEAVE WHEN THE HOST DOES.**\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._`);

				if(userInfo.hosting) {
					setUserInfo(0, message.channel.author.id, 'currentwave', parseInt(userInfo.currentwave) + 1).then().catch();
				}
			}
		});

	},
};