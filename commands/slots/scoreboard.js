const getSlots = require('../../util/getSlots');
const getUserInfo = require('../../util/getUserInfo.js');
const checkMentions = require('../../util/checkMentions.js');
const ms = require('ms');
module.exports = {
	include: false,
	name: 'scoreboard',
	aliases: [''],
	description: "Get the users last win.",
	config: 'wavehost',
	noPrefix: true,
	roles: ['slotsUserRoles', 'roleAdmin'],
	channels: ['slotsChannels'],
	// cooldown: 60,
	execute(message, args, client, logger) {
		(async function () {

			// const user = checkMentions(message, args);

			const slots = await getSlots(
				process.env.workbookWavehost,
				process.env.sheetSlots,
			).catch((error) => {
				logger.log({
					level: 'error',
					message: error,
				});
			});

			if (!slots) {
				return message.channel.send(
					`<@${user.id}>, an error occured, please try again.`,
				);
			}

			const spins = await getUserInfo(
				process.env.workbookWavehost,
				process.env.sheetSpins,
				user,
				"all",
			).catch((error) => {
				logger.log({
					level: 'error',
					message: error,
				});
			});
			

			if(!spins) {
				return message.channel.send(
					`<@${user.id}> has not spun yet.`,
				);
			}

			let score = 0;
			let lastWinMessage = 'Keep spinning.';
			let firstWinMessage = '... sorry mate.';

			const wins = spins.filter(spin => spin.win === 'TRUE');

			if(wins.length > 0) {
				wins.sort((a,b) => {
					if (a.datetime > b.datetime) return -1;
					if (a.datetime < b.datetime) return 1;
					return 0;
				});

				const lastWin = wins[0];
				const lastWinDate = Date.parse(lastWin.datetime);
				const now = new Date();
				const timeSinceLastWin = ms(now - lastWinDate);
				lastWinMessage = `${timeSinceLastWin} ago with ${slots[lastWin.slot1]['emoji']} ${slots[lastWin.slot2]['emoji']} ${slots[lastWin.slot3]['emoji']}`;

				const firstWin = wins[wins.length - 1];
				const firstWinDate = Date.parse(firstWin.datetime);
				const timeSinceFirstWin = ms(now - firstWinDate);
				firstWinMessage = `${timeSinceFirstWin} ago with ${slots[firstWin.slot1]['emoji']} ${slots[firstWin.slot2]['emoji']} ${slots[firstWin.slot3]['emoji']}`;

				wins.forEach((win) => {
					score += parseInt(win.xp)
				});
			}

			const embed = {
				color: client.config.guild.embedColor,
				title: `Spin win history`,
				description: `<@${user.id}>`,
				author: {
					name: 'PokémonGO Remote Raiders',
					icon_url:
						'https://raw.githubusercontent.com/PokemonGO-REMOTE-RAIDERS/pgrr-triple-threat/main/assets/pgrr-logo.png',
				},
				fields: [
					{
						name: 'Last Win',
						value: lastWinMessage,
						inline: false,
					},
					{
						name: 'First Win',
						value: firstWinMessage,
						inline: false,
					},
					{
						name: 'Total Wins',
						value: `${wins.length}`,
						inline: false,
					},
					{
						name: 'Current Score',
						value: `${score}`,
						inline: false,
					},
				],
				timestamp: now,
				footer: {
					text: 'If you have questions, please tag @manager',
				},
			};

			message.channel.send({ embed: embed });

			console.log(embed);


			


		})().catch((error) => {
			logger.log({ level: 'error', message: error });
		});
	},
};
