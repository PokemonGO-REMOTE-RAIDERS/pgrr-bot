const setUserInfo = require('../../util/setUserInfo.js');
const getUserInfo = require('../../util/getUserInfo.js');
const ms = require('ms');
module.exports = {
	name: 'snicker',
	description: 'Send a user to snickers',
	config: 'snickers',
	args: true,
	cooldown: 5,
	// roles: ['roleAdmin'],
	expectedArgs: 1,
	execute(message, args, client) {
		(async function() {

			const user 	= message.mentions.users.first();
			const member 	= message.channel.guild.members.cache.get(user.id);
			const reason 	= args['content'] ? args['content'] : 'No reason was provided.';
			const mod 	= message.channel.guild.members.cache.get(message.author.id);

			console.log(mod);

			if(!member) {
				return message.channel.send('No member found');
			}

			const now = new Date();
			const userInfo = await getUserInfo(process.env.workbookSnickers, process.env.sheetSnickersDB, user, 'row').catch();

			// Remove Verified Role
			const pokenavVerified = message.channel.guild.roles.cache.find(role => role.id === client.config.guild.roleVerified);
			member.roles.remove(pokenavVerified);

			// Create Channel
			const channelName = `🍫-${user.username}-${user.discriminator}`;
			const modAllow = ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS'];

			const channelOptions = {
				type: 'text',
				parent: client.config.guild.category,
				permissionOverwrites: [
					{
						id: user.id,
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'ADD_REACTIONS'],
						deny: ['MANAGE_CHANNELS', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'MANAGE_WEBHOOKS', 'MENTION_EVERYONE', 'MANAGE_MESSAGES'],
					},
					{
						id: message.guild.roles.everyone.id,
						deny: ['VIEW_CHANNEL'],
					},
				],
			};

			if(client.config.guild.roleAdmin) {
				client.config.guild.roleAdmin.forEach(role => {

					// const thisRole = message.channel.guild.roles.cache.find(r => r.id === role);
					channelOptions.permissionOverwrites.push({
						id: role,
						allow: modAllow,
					});
				});
			}

			// Create the new channel.
			message.guild.channels.create(channelName, channelOptions)

				.then(channel => {
					channel.send(`🍫🍫<@${user.id}> have a snickers.🍫🍫\n\n**YOU ARE NOT BANNED!**\n\nYou've been snickered for the following reason:\n\n${reason}\n\n------\n\n<@${mod.id}> will be with you shortly, thank you for your patience.\n\nPing @MANAGER if either party has been AFK. [canIspeak2manager]`);
					const logChannel = message.guild.channels.cache.get(client.config.guild.logChannel);

					const numSnicker = userInfo ? parseInt(userInfo.numSnickers) + 1 : 1;
					const lastSnicker = userInfo ? new Date(userInfo.lastSnicker) : false;
					const timeSinceSnicker = lastSnicker ? `${ms(now - lastSnicker, { long: true })} ago` : 'N/A';
					const modName = mod.nickname ? mod.nickname : mod.user.username;

					logChannel.send(
						{
							embed: {
								color: client.config.guild.embedColor,
								author: {
									name: 'Snicker created for',
									icon_url: client.config.guild.botIcon,
								},
								title: `${user.username}`,
								description: reason,
								fields: [
									{
										name: 'Channel',
										value: `<#${message.channel.id}>`,
									},
									{
										name: 'Number of Snickers',
										value: numSnicker,
									},
									{
										name: 'Last Snicker',
										value: timeSinceSnicker,
									},
								],
								timestamp: new Date(),
								footer: {
									text: `${modName} snickered ${user.username}`,
								},
							},
						},
					);

					const newSnicker = {
						userid: user.id,
						moderatorID: mod.id,
						initialChannel: message.channel.id,
						snickerChannel: channel.id,
						startDateTime: now,
						isActive: true,
						reasonOpen: reason,

					};

					setUserInfo(process.env.workbookSnickers, process.env.sheetSnickers, user, newSnicker, null, true)
						.then(() => {
							if(!userInfo) {
								const setDB = {
									userid: user.id,
									discordName: `${user.username}#${user.discriminator}`,
									serverNickname: member.nickname ? member.nickname : user.username,
									numSnickers: numSnicker,
									lastSnicker: now,
								};

								setUserInfo(process.env.workbookSnickers, process.env.sheetSnickersDB, user, setDB, null, true).catch();
							}
							else {
								const setDB = [
									{ data: 'numSnickers', value: numSnicker },
									{ data: 'lastSnicker', value: now },
								];
								setUserInfo(process.env.workbookSnickers, process.env.sheetSnickersDB, user, setDB, null).catch();
							}
						}).catch();
				})

				.catch(errors => console.log(errors));

		})();
	},
};
