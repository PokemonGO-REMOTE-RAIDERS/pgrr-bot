module.exports = {
	name: 'list8ball',
	// aliases: [ '8balls', 'eightball', '8bal', 'ball'],
	description: 'An 8ball command to replace the one from Carl. No prefix needed.',
	config: false,
	noPrefix: true,
	// cooldown: 60,
	execute(message) {
		const generalResponses = [
			'As I see it, yes',
			'Ask again later',
			'Better not tell you now',
			'Cannot predict now',
			'Concentrate and ask again',
			'Don\'t count on it',
			'It is certain',
			'It is decidedly so',
			'Most likely',
			'My reply is no',
			'My sources say no',
			'Outlook not so good',
			'Outlook good',
			'Reply hazy, try again',
			'Signs point to yes',
			'Very doubtful',
			'Without a doubt',
			'Yes',
			'No',
			'I\'m positive you will',
			'You may rely on it',
		];

		let responses = generalResponses;

		// Limit these to BX
		const bxRooms = [
			'829158987555012619',
			'763560311327293460',
			'827925149605036053',
			'832057829925978112',
			'832057749281701888',
			'831954736919347220',
			'828302052924325928',
			'827925149605036053',
			'878230563608223834',
			'829158987555012619',
			'828302052924325928',
		];

		if(bxRooms.includes(message.channel.id)) {

			const bxResponses = [
				'No, Amanda took a wrong turn to this gym',
				'No, Amanda kicked Bill out of the car and you\'re on his team',
				'Yes, Bill poo\'d successfully',
				'No, Streaks hasn\'t done enough shots',
				'Yes, Streaks has shots ready',
			];

			responses = generalResponses.concat(bxResponses);

		}

		let listResponses = String();
		responses.forEach((response) => {
			listResponses += `${response}\n`;
		});

		message.channel.send(`🎱 | 8Ball Responses for this channel:\n${listResponses}`);


	},
};
