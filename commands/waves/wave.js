module.exports = {
	name: 'wave',
	description: 'Let a wave know which one is happening next.',
	noPrefix: true,
	execute(message, args) {
		const amount = parseInt(args[0]);

		if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		}
		else if (amount < 0 || amount > 100) {
			return message.reply('you need to input a number between 1 and 99.');
		}

		message.channel.send(`**✨WAVE ${amount} SENDING INVITES✨**\n\n**DON’T LEAVE WHEN THE HOST DOES.**\n_LEAVE ONLY AT 10 SECONDS IF YOU HAVE LESS PEOPLE THAN RECOMMENDED._`);

	},
};
