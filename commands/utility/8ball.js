module.exports = {
	name: '8ball',
	aliases: [ '8balls', 'eightball', '8bal', 'ball'],
	description: 'Delete a tc that was just posted by PGRR bot',
	cooldown: 8,
	noPrefix: true,
	execute(message) {

		function randomNumber(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}
		const user = message.author;

		const responses = [
			'It is certain',
			'Better not tell you now',
			'My reply is no',
			'As I see it, yes',
			'My sources say no',
			'You may rely on it',
			'It is decidedly so',
			'Without a doubt',
			'Outlook good',
			'did Bill have to stop and poop during this BX train',
			'did Amanda kick Bill outta the car and make him walk home',
		];

		const responseIndex = randomNumber(0, responses.length - 1);

		// console.log(responseIndex, responses.length, responses);

		message.channel.send(`🎱 | ${responses[responseIndex]}, <@${user.id}>,`);


	},
};
