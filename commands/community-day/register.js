const setUserInfo = require('../../util/setUserInfo.js');
const getUserInfo = require('../../util/getUserInfo.js');
const getTeamRole = require('../../util/getTeamRole.js');
const checkDateValidation = require('../../util/checkDateValidation.js');
module.exports = {
	name: 'register',
	description: 'Register for community day',
	config: 'cd',
	args: false,
	cooldown: 5,
	noPrefix: true,
	roles: ['roleCDUser', 'roleCDAdmin'],
	channels: ['channelRegister'],
	execute(message, args, client) {
		(async function() {
			const user = message.author;
			const member = message.guild.members.cache.get(user.id);
			const userInfo = await getUserInfo(process.env.workbookCD, process.env.sheetCDDatabase, user, 'row').catch();
			let memberName = new String();
			memberName = member.nickname ? member.nickname : user.username;

			const startDate = client.config.guild.enrollmentStart;
			const endDate = client.config.guild.enrollmentEnd;

			const dateValidation = checkDateValidation(startDate, endDate);

			if(dateValidation == 'early' || dateValidation == 'late') {
				const closedOpens = dateValidation == 'early' ? 'not open yet' : 'closed';

				return message.channel.send(`<@${user.id}>, community day registrations are ${closedOpens}.`);
			}

			if(userInfo) {

				const newEventRegistration = {
					userid: user.id,
					discordName: memberName,
					ign: userInfo.ign,
					level: userInfo.level,
					team: userInfo.team,
					enrollDate: new Date().toLocaleDateString('en-us'),
				};

				message.react('👌');

				const eventUserInfo = await getUserInfo(process.env.workbookCD, client.config.guild.eventID, user, 'row').catch();

				if(eventUserInfo) {
					message.channel.send(`<@${user.id}> you have already registered for this event.`);
					message.reactions.removeAll().then(() => message.react('👍')).catch();
					return;
				}

				setUserInfo(process.env.workbookCD, client.config.guild.eventID, user, newEventRegistration, null, true)

					.then(() => {
						setUserInfo(process.env.workbookCD, process.env.sheetCDDatabase, user, 'numEnrollments', parseInt(userInfo.numEnrollments) + 1, false).catch();
					})

					.then(() => {
						message.reactions.removeAll().then(() => message.react('👍')).catch();
					})

					.then(() => {
						message.channel.send({ embed: {
							color: client.config.guild.embedColor,
							author: {
								name: client.config.guild.botName,
								icon_url: client.config.guild.botIcon,
							},
							title: 'Community Day Registration',
							description: `<@${user.id}>, thank you for registering for our ${client.config.guild.eventName} Community Day event, please confirm your information below:`,
							fields: [
								{
									name: 'IGN',
									value: userInfo.ign,
									inline: true,
								},
								{
									name: 'Level',
									value: userInfo.level,
									inline: true,
								},
								{
									name: 'Team',
									value: userInfo.team,
									inline: true,
								},
								{
									name: 'Update Your Info',
									value: 'If any of your information has not been processed correctly please use `cdu {ign, lvl, or team} {correct value}` to fix your information.\n\nFor example, `cdu ign Nhemps311` to fix my in-game name.\n\n---',
								},
							],
						} });
					})

					.catch((error) =>{
						message.channel.send('Sorry, there was an error.  Please try again later.');
						console.log(error);
					});

			}

			else {

				if(!message.attachments.first()) {
					return message.reply('Please upload a screenshot of your trainer profile with the command `register`');
				}

				message.react('👌');

				const newUser = {
					userid: user.id,
					verified: false,
					discordName: memberName,
					ign: '',
					level: '',
					team: getTeamRole(message, client),
					profileScreenshot: message.attachments.first().url,
					initialEnrollDate: new Date(),
					numEnrollments: 1,
					numSubmissions: 0,
					numWins: 0,
					numTop10: 0,
				};

				const attachments = message.attachments.array();
				const axios = require('axios').default;

				// Promises, promises, how I hate thee. Fire off a resolve to reset, just in case
				let sequences = Promise.resolve();

				// new Array to combine screenshots later.
				const screenshots = new Array();

				// Loop through the attachments
				for(const attachment of attachments) {

					// Add a sequence to the sequence Promise.
					sequences = sequences.then(() => {

						return new Promise((resolve, reject) => {

							// Microsoft Vision OCR options
							const options = {
								method: 'POST',
								url: 'https://microsoft-computer-vision3.p.rapidapi.com/ocr',
								params: {
									detectOrientation: 'true',
									language: 'unk',
								},
								headers: {
									'content-type': 'application/json',
									'x-rapidapi-key': process.env.rapidApiKey,
									'x-rapidapi-host': 'microsoft-computer-vision3.p.rapidapi.com',
								},
								data: {
									url: attachment.url,
								},
							};

							// Send screenshot to MS Vision
							axios.request(options).then(function(response) {

								// Push the results to screenshots array
								screenshots.push(response.data);

								// Resolve this Promise, so we ca move on to the next one.
								resolve(response.data);

							}).catch(function(error) {
								// Catch any errors
								reject(error);
								console.error(error);
							});

						});
					});
				}

				// Loop all of the promises sequentially.
				sequences.then(items => {

					// I don't like the this is done, need to figure out a better way.
					// Vision OCR object is DEEP and has a lot of arrays, so this is the way for now.
					const words = new Array();
					const text = new Array();

					// Drill down into the OCR response and push to words[].
					screenshots.forEach(s => {
						s.regions.forEach(r => {
							r.lines.forEach(l => {
								words.push(l.words);
							});
						});
					});

					// Drill down further, because as I mentioned, it's a deep object.
					words.forEach(w => {
						w.forEach(word => {
							// Push words[] to text[]
							text.push(word.text);
						});
					});

					const and = text.indexOf('&');
					const ign = and - 1;
					newUser.ign = text[ign] ? text[ign] : 'Not found';
					let checkIgn = new String();
					checkIgn = newUser.ign;

					const possibleLevels = new Array();

					possibleLevels.push(text[and + 2]);
					possibleLevels.push(text[and + 3]);
					possibleLevels.push(text[and + 4]);
					possibleLevels.push(text[and + 5]);

					const regex = new RegExp(/^[0-9]+$/);

					const level = possibleLevels
						// exlude special characters
						.filter(elem => regex.test(elem))
						// exlude anything smaller than 3 charaters
						.filter(elem => elem >= 1 && elem <= 50)
						// duplicates check
						.filter((elem, index, self) => {
							return index === self.indexOf(elem);
						});

					newUser.level = level[0] ? level[0] : 'Not found';

					setUserInfo(process.env.workbookCD, process.env.sheetCDDatabase, user, newUser, null, true)

						.then(() => {

							message.reactions.removeAll().then(() => message.react('👍')).catch();

							message.channel.send(
								{
									embed: {
										color: client.config.guild.embedColor,
										author: {
											name: client.config.guild.botName,
											icon_url: client.config.guild.botIcon,
										},
										title: 'Community Day Registration',
										description: `<@${user.id}>, thank you for registering for our ${client.config.guild.eventName} Community Day event, please confirm your information below:`,
										fields: [
											{
												name: 'IGN',
												value: newUser.ign,
												inline: true,
											},
											{
												name: 'Level',
												value: newUser.level,
												inline: true,
											},
											{
												name: 'Team',
												value: newUser.team,
												inline: true,
											},
											{
												name: 'Update Your Info',
												value: 'If any of your information has not been processed correctly please use `cdu {ign, lvl, or team} {correct value}` to fix your information.\n\nFor example, `cdu ign Nhemps311` to fix my in-game name.\n\n---',
											},
											{
												name: 'Event Details',
												value: client.config.guild.eventDescription,
											},
										],
									},
								},
							);

							if(memberName.toLowerCase() !== checkIgn.toLowerCase()) {
								message.channel.send(`<@${user.id}> please make sure your IGN and Server Nickname match`);
							}
						})

						.then(() => {
							const newEventRegistration = {
								userid: user.id,
								discordName: user.username,
								ign: newUser.ign,
								level: newUser.level,
								team: newUser.team,
								enrollDate: newUser.initialEnrollDate,
							};
							setUserInfo(process.env.workbookCD, client.config.guild.eventID, user, newEventRegistration, null, true).catch();
						})

						.catch();

				}).catch(err => {
					console.log(err);
					message.channel.send('An error has occurred, please resubmit.');
				});

			}

		})();
	},
};
