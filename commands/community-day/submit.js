const setUserInfo = require('../../util/setUserInfo.js');
const getUserInfo = require('../../util/getUserInfo.js');
const checkDateValidation = require('../../util/checkDateValidation.js');
module.exports = {
	name: 'submit',
	description: 'Submit your Community Day Event Pokemon',
	config: 'cd',
	args: false,
	cooldown: 5,
	noPrefix: true,
	roles: ['roleCDUser', 'roleCDAdmin'],
	channels: ['channelSubmit'],
	execute(message, args, client) {
		(async function() {
			const user = message.author;
			const startDate = client.config.guild.submitStart;
			const endDate = client.config.guild.submitEnd;

			const dateValidation = checkDateValidation(startDate, endDate);

			if(dateValidation == 'early' || dateValidation == 'late') {
				const closedOpens = dateValidation == 'early' ? 'not open yet' : 'closed';

				return message.channel.send(`<@${user.id}>, community day submissions are ${closedOpens}.`);
			}

			const userInfo = await getUserInfo(process.env.workbookCD, client.config.guild.eventID, user, 'row').catch();
			if(!userInfo) {
				return message.channel.send(`<@${user.id}>, you are not registered for this Community Day event, please be sure to submit your registration before the deadline. This community day deadline was ${client.config.guild.enrollmentEnd}.`);
			}

			const attachments = message.attachments.array();
			const axios = require('axios').default;

			if(attachments.length == 0) {
				return message.channel.send(`<@${user.id}> please upload a screeshot of your submission with the appraisal window open.`);
			}

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

			message.react('👌');

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

				// console.log(text);

				const weightRegex 	= new RegExp(/^[0-9]+\.[0-9]+kg$/);
				const heightRegex 	= new RegExp(/^[0-9]+\.[0-9]+m$/);
				const dateRegex 	= new RegExp(/^[0-9]+\/[0-9]+\/[0-9]+$/);

				let weight 	= text.filter(elem => weightRegex.test(elem));
				let height 	= text.filter(elem => heightRegex.test(elem));
				let date 		= text.filter(elem => dateRegex.test(elem));

				weight 	= weight.length > 0 ? weight[0] : false;
				height 	= height.length > 0 ? height[0] : false;
				date 	= date.length > 0 ? date[0] : false;

				if(!weight || !height) {
					message.reactions.removeAll().then(() => message.react('👎')).catch();
					return message.channel.send(`<@${user.id}> this doesn't appear to be a screenshot of a pokémon, please try again.`);
				}

				if(!date) {
					message.reactions.removeAll().then(() => message.react('👎')).catch();
					return message.channel.send(`<@${user.id}> please open the appraisal window and resubmit your screenshot.`);
				}

				const customData = [
					{ data: 'height', value: height },
					{ data: 'weight', value: weight },
					{ data: 'capturedate', value: date },
					{ data: 'image', value: attachments[0].url },
				];

				console.log(customData);

				setUserInfo(process.env.workbookCD, client.config.guild.eventID, user, customData, null)

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
									title: 'Community Day Submission',
									description: `<@${user.id}>, thank you for submitting your Community Day submission, please confirm your information below:`,
									fields: [
										{
											name: 'Height',
											value: height,
											inline: true,
										},
										{
											name: 'Weight',
											value: weight,
											inline: true,
										},
										{
											name: 'Capture Date',
											value: date,
											inline: true,
										},
										{
											name: '---',
											value: 'We will verify your information and notify you if you need to submit a video.',
										},
									],
								},
							},
						);

					})
					.catch((error) => {
						console.log(error);
						message.reactions.removeAll().then(() => message.react('👎')).catch();
					});


			}).catch(err => {
				console.log(err);
				message.channel.send('An error has occurred, please resubmit.');
			});

		})();
	},
};
