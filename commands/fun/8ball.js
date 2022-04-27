const get8Balls = require('../../util/get8Ball');

module.exports = {
	include: true,	
	name: '8ball',
	aliases: [ '8balls', 'eightball', '8bal', 'ball' ],
	description: 'An 8ball command to replace the one from Carl. No prefix needed.',
	config: false,
	noPrefix: true,
	cooldown: 60,
	execute(message, args, client, logger) {
		(async function() {

			const the8balls = await get8Balls(process.env.workbookWavehost, process.env.sheet8ball).catch((error) => console.log(error));

			function randomNumber(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			}
			const user = message.author;

			const general = the8balls.general;

			let responses = general;

			const bxResponses = the8balls.bxResponses;
			const bxRooms = the8balls.bxRooms;

			if(bxRooms.includes(message.channel.id)) {
				responses = responses.concat(bxResponses);
			}

			const responseIndex = randomNumber(0, responses.length - 1);

			message.channel.send(`🎱 | ${responses[responseIndex]}, <@${user.id}>.`);

		}().catch((error) => { logger.log({ level: 'error', message: error }); }));

	},
};