const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
module.exports = {
	name: 'notify',
	description: 'Promote an active wave.',
	aliases: ['announce', 'announcement', 'notify', 'notification', 'promote'],
	expectedArgs: 0,
	// cooldown: 600,
	roles: ['rolewavehost'],
	args: false,
	execute(message) {
		(async function() {
			const data = 'row';
			const user = message.author;
			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, data).catch();

			if(!userInfo.hosting) {
				return message.reply(`Please start a wave host session using \`${process.env.prefix}host @boss\``);
			}
			const bossrole = message.guild.roles.cache.get(userInfo.bossid);

			if(bossrole) {
				message.channel.send(`<@&${bossrole.id}> <@&${process.env.waveriders}> <@&${process.env.bfraids}>`).then(() => {
					setUserInfo(process.env.sheetWaveHosts, user, 'notifications', parseInt(userInfo.notifications) + 1).catch();
				});
			}

		}());

	},
};