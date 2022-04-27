const getSlots = require('../../util/getSlots');

module.exports = {
	include: true,	
	name: 'slots',
	aliases: [ 'slot', 'pokemonslots', 'slotspokemon', 'solts' ],
	description: 'It\'s slots ... with Pokemon.',
	config: false,
	noPrefix: true,
	cooldown: 10,
	execute(message, args, client, logger) {
		(async function() {

			const slots = await getSlots(process.env.workbookWavehost, process.env.sheetSlots).catch((error) => console.log(error));

			function randomNumber(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			}
			const user = message.author;

			if(!slots) {
				return message.channel.send(`<@${user.id}>, an error occured, please try again.`);
			}

			const slotOneIndex = randomNumber(1, slots.length - 1);
			const slotTwoIndex = randomNumber(1, slots.length - 1);
			const slotThreeIndex = randomNumber(1, slots.length - 1);

			const slotOne = slots[slotOneIndex];
			const slotTwo = slots[slotTwoIndex];
			const slotThree = slots[slotThreeIndex];

			message.channel.send(`${slotOne.emoji} ${slotTwo.emoji} ${slotThree.emoji} <@${user.id}>`);

		}().catch((error) => { logger.log({ level: 'error', message: error }); }));

	},
};