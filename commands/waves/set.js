const setUserInfo = require('../../util/setUserInfo.js');
const getUserInfo = require('../../util/getUserInfo.js');
const ms = require('ms');
module.exports = {
	name: 'set',
	description: 'Set information about a wavehost. Only accessible by mod or the actual wavehost.',
	args: true,
	cooldown: 5,
	roles: ['roleWaveHost', 'roleAdmin'],
	expectedArgs: 1,
	validArgs: [
		{
			name: 'ign',
			aliases: ['name', 'trainername'],
		},
		{
			name: 'tc',
			aliases: ['trainercode', 'code', 'trainer'],
		},
		{
			name: 'location',
			aliases: ['state', 'country', 'area'],
		},
		{
			name: 'rules',
			aliases: ['rule'],
		},
		{
			name: 'timer',
			aliases: ['delete', 'timer'],
		},
		{
			name: 'failed',
			aliases: ['fail', 'fails'],
		},
		{
			name: 'failtc',
			aliases: ['failedtc', 'tcfail', 'trainercodefail', 'showtc'],
		},
		{
			name: 'closed',
			aliases: ['close', 'closing'],
		},
		{
			name: 'last',
			aliases: ['lasts'],
		},
	],
	execute(message, args, client) {
		(async function() {
			const data = args[0];
			let value = args['content'];
			const user = message.author;
			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, 'row').catch();

			if(data == 'timer') {
				value = ms(value);
			}

			if(!userInfo) {
				const newUser = {
					userid: user.id,
					ign: 'not set',
					tc: 'not set',
					location: 'not set',
					failed: 'not set',
					closed: 'not set',
					last: 'not set',
					rules: 'not set',
					hosts: 0,
					maxwaves: 0,
					timer: 0,
					notifications: 0,
					hosting: false,
					currentwave: 0,
				};

				newUser[data] = value;

				setUserInfo(process.env.sheetWaveHosts, user, newUser, null, true).then(() => {

					if(data == 'ign') {
						message.channel.send(`<@${user.id}> You've been added as wavehost! Next set your trainer code by using \`${client.config.prefix}set tc\``);
					}
					else if(data == 'tc') {
						message.channel.send(`<@${user.id}> You've been added as wavehost! Next set your in game name by using \`${client.config.prefix}set ign\``);
					}


				}).catch((error) => {
					message.channel.send(`Error trying to add new wavehost ${user.username}, please try again later or contact a manager!`);
					console.log(error);
				});
			}
			else {

				setUserInfo(process.env.sheetWaveHosts, user, data, value)
					.then((response) => {
						if(response) {
							message.channel.send(
								{
									embed: {
										color: client.config.embedColor,
										author: {
											name: `${user.username} WaveHost Profile Updated`,
											icon_url: client.config.botIcon,
										},
										title: `${data} updated to:`,
										description: args['content'],
										fields: [
											{
												name: `${data} was:`,
												value: userInfo[data],
											},
										],
									},
								});
						}
					})
					.catch((error) =>{
						message.channel.send('Sorry, there was an error.  Please try again later.');
						console.log(error);
					});
			}
		})();
	},
};
