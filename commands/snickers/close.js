const setSnickers = require('../../util/setSnickers.js');
const getSnickers = require('../../util/getSnickers.js');
const ms = require('ms');
const fs = require('fs');
module.exports = {
	name: 'close',
	description: 'End a snicker session',
	config: 'snickers',
	args: true,
	cooldown: 5,
	// roles: ['roleAdmin'],
	expectedArgs: 1,
	execute(message, args, client) {
		(async function() {

			const snicker = await getSnickers(process.env.workbookSnickers, process.env.sheetSnickers, message.channel.id, 'row').catch();
			if(!snicker) {
				return message.channel.send('No snicker found for this channel, please make sure to use `close` in a snicker channel.');
			}

			const member = message.channel.guild.members.cache.get(snicker.userid);
			if(!member) {
				message.channel.send('No member found, proceeding to close out snicker.');

				// NOT SURE WHAT TO DO IS A USE GETS BANNED AND I CAN'T LOG ANYTHING...
			}

			const user = member.user;
			const reason = args['content'] ? args['content'] : 'No reason was provided.';
			const closeMod = message.channel.guild.members.cache.get(message.author.id);


			// Remove Verified Role
			const pokenavVerified = message.channel.guild.roles.cache.find(role => role.id === client.config.guild.roleVerified);
			member.roles.add(pokenavVerified);

			// Scrape Channel
			message.channel.messages.fetch({ limit: 100 }).then(messages => {
				console.log(`Received ${messages.size} messages`);

				const logMessages = new Array();
				// Iterate through the messages here with the variable "messages".
				messages.filter(u => !u.author.bot).forEach(m => {
					const dateObject = new Date(m.createdTimestamp);

					const userType = user.id == m.author.id ? '(User)' : '(Staff)';

					const logMessage = `[${dateObject.toLocaleString('en-us')}] ${m.author.username} ${userType}: ${m.content}`;

					logMessages.push(logMessage);
				});

				// const now = new Date().toLocaleString({ year: 'numeric', month: 'numeric', day: 'numeric' });
				const logTextFile = logMessages.reverse().join('\n');
				const logChannel = message.guild.channels.cache.get(client.config.guild.logChannel);
				const fileName = `temp/snicker-${user.username}.txt`;

				function unlinkSnickerFile(theFile) {
					fs.unlink(theFile, () => console.log('file deleted'));
				}


				try {
					fs.writeFile(fileName, logTextFile, () => {
						console.log('file created...sending to logs.');
						logChannel.send('Snicker Complete', {
							files: [fileName],
						}).then(() => {
							unlinkSnickerFile(fileName);
						});
					});

				}
				catch (error) {
					console.log(error);
				}


			});

			// const userInfo = await getUserInfo(process.env.workbookWavehost, process.env.sheetWaveHosts, user, 'row').catch();

		})();
	},
};
