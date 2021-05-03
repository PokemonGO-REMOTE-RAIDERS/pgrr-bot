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
						value: `To register, go to <#${client.config.guild.channelRegister[0]}>, you will use the command \`%register\`, and **IN THE SAME MESSAGE** attach a photo of your trainer profile.`,
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
