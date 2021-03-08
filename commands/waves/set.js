const setUserInfo = require('../../util/setUserInfo.js');
module.exports = {
	name: 'set',
	description: 'Set information about a wavehost. Only accessible by mod or the actual wavehost.',
	args: true,
	expectedArgs: 1,
	validArgs: [
		{
			name: 'ign',
			aliases: ['name', 'trainername'],
		},
		{
			name: 'userid',
			aliases: ['id', 'user'],
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
	],
	execute(message, args) {
		const data = args[0];
		const value = args['content'];
		const user = message.author.id;
		console.log({ user, data, value });

		setUserInfo(0, user, data, value)
			.then((response) => {
				message.channel.send(response);
			})
			.catch((error) =>{
				message.channel.send('Sorry, there was an error.  Please try again later.');
				console.log(error);
			});
	},
};
