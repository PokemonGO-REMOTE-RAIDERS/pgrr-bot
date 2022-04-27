const checkDateValidation = require('../../util/checkDateValidation.js');
const botConfig = require('../../util/configSetup.js');
module.exports = {
	include: true,	
	name: 'cd',
	description: 'Get information about community day',
	args: false,
	cooldown: 5,
	config: 'cd',
	noPrefix: true,
	execute(message, args, client, logger) {
		(async function() {
			const config = await botConfig(
				process.env.workbookCD,
				process.env.sheetCDConfig,
			).catch((error) => console.log(error));
			const cdConfig =
				message.guild.id === config.production.guild
					? config.production
					: config.development;
			const messageEmbed = {
				color: cdConfig.embedColor,
				author: {
					name: cdConfig.botName,
					icon_url: cdConfig.botIcon,
				},
				title: `${cdConfig.eventName} Community Day Event`,
				description: `${cdConfig.eventDescription}`,
				timestamp: new Date(cdConfig.enrollmentEnd),
				footer: {
					text: 'Registration ends',
				},
			};

			const submitStartDate = cdConfig.submitStart;
			const submitEndDate = cdConfig.submitEnd;

			const enrollmentStartDate = cdConfig.enrollmentStart;
			const enrollmentEndDate = cdConfig.enrollmentEnd;

			const submitDateValidation = checkDateValidation(
				submitStartDate,
				submitEndDate,
			);
			const enrollmentDateValidation = checkDateValidation(
				enrollmentStartDate,
				enrollmentEndDate,
			);

			if (enrollmentDateValidation == 'open') {
				messageEmbed.fields = [
					{
						name: 'How to Register',
						value: `To register, go to <#${cdConfig.channelRegister[0]}>, you will use the command \`register\`. If this is your first time registering attach a photo of your trainer profile **IN THE SAME MESSAGE**.`,
					},
				];
			} else if (submitDateValidation == 'open') {
				messageEmbed.fields = [
					{
						name: 'How to Submit',
						value: `To submit pick your best **shiny**, go to <#${cdConfig.channelSubmit[0]}>, you will use the command \`%submit\`, and **IN THE SAME MESSAGE** attach two screenshots: one with the pokemon and its stats and one with the appraisal window open.`,
					},
				];
			} else {
				messageEmbed.fields = [
					{
						name: 'Community Day Is Closed',
						value:
							'Thank you for your interest in community day, however registration and submission are closed at the moment.',
					},
				];
			}

			message.channel.send({ embed: messageEmbed });
		}().catch((error) => { logger.log({ level: 'error', message: error }); }));
	},
};
