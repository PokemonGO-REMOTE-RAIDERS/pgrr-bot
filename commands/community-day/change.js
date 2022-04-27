const setUserInfo = require('../../util/setUserInfo.js');
const getUserInfo = require('../../util/getUserInfo.js');

module.exports = {
	include: true,	
	name: 'change',
	description: 'Change information about a Community Day participant.',
	args: true,
	cooldown: 5,
	config: 'cd',
	roles: ['roleCDUser', 'roleCDAdmin'],
	expectedArgs: 1,
	aliases: ['fix', 'change', 'changed', 'cdu'],
	noPrefix: true,
	validArgs: [
		{
			name: 'ign',
			aliases: ['name', 'trainername'],
		},
		{
			name: 'level',
			aliases: ['lvl', 'level', 'lvel'],
		},
		{
			name: 'team',
			aliases: ['teams', 'tm', 'teem'],
		},
	],
	execute(message, args, client, logger) {
		(async function() {
			const data = args[0];
			const value = args['content'];
			const user = message.author;
			const userInfo = await getUserInfo(
				process.env.workbookCD,
				process.env.sheetCDDatabase,
				user,
				'row',
			).catch();

			if (!userInfo) {
				message.channel.send(
					`<@${user.id}>, please upload a screenshot of your trainer profile with the command \`${client.prefix}register\``,
				);
			} else {
				setUserInfo(
					process.env.workbookCD,
					process.env.sheetCDDatabase,
					user,
					data,
					value,
				)
					.then((response) => {
						if (response) {
							message.channel.send({
								embed: {
									color: client.config.guild.embedColor,
									author: {
										name: 'Community Day Information Change',
										icon_url: client.config.guild.botIcon,
									},
									title: `${data} updated to:`,
									description: args['content'],
								},
							});

							setUserInfo(
								process.env.workbookCD,
								client.config.guild.eventID,
								user,
								data,
								value,
							).catch();
						}
					})
					.catch((error) => {
						logger.log({
							level: 'error',
							message: error,
						});
						return message.channel.send(
							'Sorry, there was an error.  Please try again later.',
						);
					});
			}
		})();
	},
};
