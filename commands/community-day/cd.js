const checkDateValidation = require('../../util/checkDateValidation.js');
module.exports = {
	name: 'cd',
	description: 'Get information about community day',
	config: 'cd',
	args: false,
	cooldown: 5,
	noPrefix: true,
	execute(message, args, client) {
		(async function() {

			const messageEmbed = {
				color: client.config.guild.embedColor,
				author: {
					name: client.config.guild.botName,
					icon_url: client.config.guild.botIcon,
				},
				title: `${client.config.guild.eventName} Community Day Event`,
				description: `${client.config.guild.eventDescription}`,
				timestamp: new Date(client.config.guild.enrollmentEnd),
				footer: {
					text: 'Registration ends',
				},
			};

			const submitStartDate = client.config.guild.submitStart;
			const submitEndDate = client.config.guild.submitEnd;

			const enrollmentStartDate = client.config.guild.enrollmentStart;
			const enrollmentEndDate = client.config.guild.enrollmentEnd;

			const submitDateValidation = checkDateValidation(submitStartDate, submitEndDate);
			const enrollmentDateValidation = checkDateValidation(enrollmentStartDate, enrollmentEndDate);

			if(enrollmentDateValidation == 'open') {
				messageEmbed.fields = [
					{
						name: 'How to Register',
						value: `To register, go to <#${client.config.guild.channelRegister[0]}>, you will use the command \`%register\`. If this is your first time registering attach a photo of your trainer profile **IN THE SAME MESSAGE**.`,
					},
				];
			}
			else if(submitDateValidation == 'open') {
				messageEmbed.fields = [
					{
						name: 'How to Submit',
						value: `To submit pick your best **shiny**, go to <#${client.config.guild.channelSubmit[0]}>, you will use the command \`%submit\`, and **IN THE SAME MESSAGE** attach two screenshots: one with the pokemon and its stats and one with the appraisal window open.`,
					},
				];
			}
			else {
				messageEmbed.fields = [
					{
						name: 'Community Is Closed',
						value: 'Thank you for your interest in community day, however registration and submission are closed at the moment.',
					},
				];
			}


			message.channel.send({ embed: messageEmbed });
		})();
	},
};
