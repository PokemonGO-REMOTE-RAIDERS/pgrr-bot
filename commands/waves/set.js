const setUserInfo = require('../../util/setUserInfo.js');
const ms = require('ms');
const getUserInfo = require('../../util/getUserInfo.js');
module.exports = {
	name: 'set',
	description: 'Set information about a wavehost. Only accessible by mod or the actual wavehost.',
	args: true,
	cooldown: 5,
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
			name: 'closed',
			aliases: ['close', 'closing'],
		},
		{
			name: 'last',
			aliases: ['lasts'],
		},
	],
	execute(message, args) {

		const data = args[0];
		let value = args['content'];
		const user = message.author;

		if(data == 'timer') {
			value = ms(value);
		}
		getUserInfo(0, user, data).then((userInfo) => {

			if(!userInfo) {
				const newUser = {
					userid: user.id,
					ign: user.username,
					tc: value,
					hosts: 0,
					maxwaves: 0,
					timer: 0,
					hosting: false,
					currentwave: 0,
					failed: '**The wave has failed, please type "failed" below if you were in that wave. Delete me as a friend and readd me please.  Trainer code will show for 10 seconds.**',
					closed: '**This wave is closed, I will not accept anymore invites.**',
					last: '**Last Wave, please don\'t forget to delete me!**',
				};

				setUserInfo(0, user, newUser, null, true).then((response) => {
					if(response) {
						message.channel.send(`New wavehost ${user.username} added! Next set your rules by using \`${process.env.prefix}set rules`);
					}
				}).catch((error) => {
					message.channel.send(`Error trying to add new wavehost ${user.username}, please try again later or contact a manager!`);
					console.log(error);
				});
			}
			else {

				setUserInfo(0, user, data, value)
					.then((response) => {
						if(response) {
							message.channel.send(
								{
									embed: {
										color: process.env.color,
										author: {
											name: `${user.username} Profile Updated`,
											icon_url: process.env.icon,
										},
										footer: {
											name: 'PokémonGO Remote Raiders',
											icon_url: process.env.icon,
										},
										title: `Information: ${data}`,
										description: value,
									},
								});
						}
					})
					.catch((error) =>{
						message.channel.send('Sorry, there was an error.  Please try again later.');
						console.log(error);
					});
			}
		}).catch();
	},
};
