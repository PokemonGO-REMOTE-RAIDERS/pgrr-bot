const getUserInfo = require('../../util/getUserInfo.js');
const getHistoricalWaves = require('../../util/getHistoricalWaves.js');
const ms = require('ms');
module.exports = {
	name: 'profile',
	description: 'Get historical information about a wavehost.',
	aliases: ['wavehost', 'waveprofile'],
	// args: true,
	// roles: ['rolewavehost', 'roleadmin'],
	cooldown: 5,
	execute(message, args) {
		(async function() {
			const data = args[0];
			let user;
			if(args['mention']) {
				user = {	id: args['mention'] };
			}
			else {
				user = message.author;
			}

			const userInfo = await getUserInfo(process.env.sheetWaveHosts, user, 'row');
			const wavehistory = await getHistoricalWaves(user);

			if(!userInfo) {
				return;
			}

			// console.log(userInfo);
			// console.log(wavehistory);
		}());
	},
};
