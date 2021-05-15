module.exports = {
	name: 'cd',
	description: 'Get information about community day',
	config: 'cd',
	args: false,
	cooldown: 5,
	execute(message, args, client) {
		(async function() {

			message.channel.send({ embed: {
				color: client.config.guild.embedColor,
				author: {
					name: client.config.guild.botName,
					icon_url: client.config.guild.botIcon,
				},
				title: `${client.config.guild.eventName} Community Day Event`,
				description: `${client.config.guild.eventDescription}`,
				fields: [
					{
						name: 'How to Register',
						// value: `To register, go to <#${client.config.guild.channelRegister[0]}>, you will use the command \`%register\`, and **IN THE SAME MESSAGE** attach a photo of your trainer profile.`,
						value: `To submit pick your best **shiny**, go to <#${client.config.guild.channelSubmit[0]}>, you will use the command \`%submit\`, and **IN THE SAME MESSAGE** attach two screenshots: one with the pokemon and it's stats and one with the appraisal window open.`,
					},
				],
				timestamp: new Date(client.config.guild.enrollmentEnd),
				footer: {
					text: 'Registration ends',
				},
			} });
		})();
	},
};
