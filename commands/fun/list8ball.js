const get8Balls = require('../../util/get8Ball');
module.exports = {
	name: 'list8ball',
	// aliases: [ '8balls', 'eightball', '8bal', 'ball'],
	description: 'An 8ball command to replace the one from Carl. No prefix needed.',
	config: false,
	noPrefix: true,
	// cooldown: 60,
	execute(message) {
		(async function() {

			const the8balls = await get8Balls(process.env.workbookWavehost, process.env.sheet8ball).catch((error) => console.log(error));

			const general = the8balls.general;

			let responses = general;

			const bxResponses = the8balls.bxResponses;
			const bxRooms = the8balls.bxRooms;

			if(bxRooms.includes(message.channel.id)) {
				responses = responses.concat(bxResponses);
			}

			let listResponses = String();
			responses.forEach((response) => {
				listResponses += `${response}\n`;
			});

			message.channel.send(`🎱 | 8Ball Responses for this channel:\n${listResponses}`);

		}().catch((error) => { console.log(error); }));

	},
};
