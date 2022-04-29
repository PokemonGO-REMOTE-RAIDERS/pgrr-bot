const getSlots = require('../../util/getSlots');
// const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
const processNotifications = require('../../util/processNotifications.js');
module.exports = {
	include: true,
	name: 'spin',
	aliases: ['spins'],
	description: "It's slots ... with Pokemon.",
	config: 'wavehost',
	noPrefix: true,
	roles: ['slotsUserRoles', 'roleAdmin'],
	channels: ['slotsChannels'],
	// cooldown: 60,
	execute(message, args, client, logger) {
		(async function () {
			
			const slots = await getSlots(
				process.env.workbookWavehost,
				process.env.sheetSlots,
			).catch((error) => {
					logger.log({
						level: 'error',
						message: error,
					});
				}
			);

			function randomNumber(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			}
			const user = message.author;
			const role = message.guild.roles.cache.get(args['role']);

			if (!slots) {
				return message.channel.send(
					`<@${user.id}>, an error occured, please try again.`,
				);
			}

			// Grab the randomized indexes
			const slotOneIndex = randomNumber(0, 9);
			const slotTwoIndex = randomNumber(0, 9);
			const slotThreeIndex = randomNumber(0, 9);

			// Get the mon from the array. 
			const slotOne = slots[slotOneIndex];
			const slotTwo = slots[slotTwoIndex];
			const slotThree = slots[slotThreeIndex];

			// console.log(slotThreeIndex);

			// Send the results to the channel. 
			const slotMessage = await message.channel.send(
				`${slotOne.emoji} ${slotTwo.emoji} ${slotThree.emoji} <@${user.id}>`,
			);
			
			let win = false;
			let xp = 0;

			// Win condition
			if ( slotOneIndex === slotTwoIndex && slotOneIndex === slotThreeIndex) {

				win = true;
				xp = slotOne.reward;
				slotMessage.pin().then().catch(console.error);
				
				const notify = processNotifications(client, 'slotsNotification', role);
				message.channel.send(`<a:AnimatedPartyPopperBadge:745495016067301547> <a:AnimatedPartyPopperBadge:745495016067301547> Congratulations <@${user.id}> you've won ${xp} XP with ${slotOne.emoji} ${slotTwo.emoji} ${slotThree.emoji}! <a:AnimatedPartyPopperBadge:745495016067301547> <a:AnimatedPartyPopperBadge:745495016067301547> ${notify}`);
				
			}

			// const date = new Date();
			const spin = {
				userid: user.id,
				datetime: new Date(),
				slot1: slotOneIndex,
				slot2: slotTwoIndex,
				slot3: slotThreeIndex,
				win: win,
				xp: parseInt(xp),
			}

			setUserInfo(
				process.env.workbookWavehost,
				process.env.sheetSpins,
				user,
				spin,
				null,
				true,
			)
				.then()
				.catch((error) => {
					logger.log({
						level: 'error',
						message: error,
					});
				});


		})().catch((error) => {
			logger.log({ level: 'error', message: error });
		});
	},
};
