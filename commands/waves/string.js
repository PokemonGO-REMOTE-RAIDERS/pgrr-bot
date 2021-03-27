const readScreenshot = require('../../util/readScreenshot.js');
module.exports = {
	name: 'string',
	aliases: [ 'ss', 'screenshot', 'stringme', 'stringify'],
	description: 'Delete a tc that was just posted by PGRR bot',
	cooldown: 5,
	roles: ['roleWaveHost'],
	execute(message) {
		readScreenshot(message);
	},
};
