const setUserInfo = require('../../util/setUserInfo.js');
const getUserInfo = require('../../util/getUserInfo.js');
module.exports = {
	name: 'register',
	description: 'Set information about a wavehost. Only accessible by mod or the actual wavehost.',
	config: 'cd',
	args: false,
	cooldown: 5,
	roles: ['roleCDUser', 'roleCDAdmin'],
	execute(message, args, client) {
		(async function() {
			const user = message.author;
			const userInfo = await getUserInfo(process.env.workbookCD, process.env.sheetCDDatabase, user, 'row').catch();

		})();
	},
};
