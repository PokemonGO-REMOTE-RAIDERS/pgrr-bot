const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
const processNotifications = require('../../util/processNotifications.js');

module.exports = {
	include: true,	
	name: 'notify',
	description: 'Promote an active wave.',
	aliases: ['announce', 'announcement', 'notify', 'notification', 'promote'],
	expectedArgs: 0,
	config: 'wavehost',
	// cooldown: 600,
	roles: ['roleWaveHost', 'roleAdmin'],
	args: false,
	execute(message, args, client, logger) {
		(async function() {
			const data = 'row';
			const user = message.author;
			const userInfo = await getUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, data).catch();

			if(!userInfo.hosting) {
				return message.reply(`Please start a wave host session using \`${client.config.guild.prefix}host @boss\``);
			}
			const bossrole = message.guild.roles.cache.get(userInfo.bossid);

			if(bossrole) {
				const notify = processNotifications(client, 'wbNotifications', bossrole);
				message.channel.send(`<@${user.id}> is hosting ${notify}`).then(() => {
					setUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'notifications', parseInt(userInfo.notifications) + 1).catch();
				});
			}

		}().catch((error) => { logger.log({ level: 'error', message: error }); }));

	},
};