const setUserInfo = require('../../util/setUserInfo.js');
const ms = require('ms');
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
	],
	execute(message, args) {
		const data = args[0];
		let value = args['content'];
		const user = message.author;

		if(data == 'timer') {
			value = ms(value);
		}
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
