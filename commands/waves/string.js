module.exports = {
	name: 'string',
	aliases: [ 'ss', 'screenshot', 'stringme', 'stringify'],
	description: 'Delete a tc that was just posted by PGRR bot',
	cooldown: 5,
	roles: ['roleWaveHost', 'roleAdmin'],
	execute(message) {
		(async function() {

			const axios = require('axios').default;
			const attachments = message.attachments.array();

			if(attachments.length > 0) {

				let sequences = Promise.resolve();
				const screenshots = new Array();
				for(const attachment of attachments) {
					sequences = sequences.then(() => {
						return new Promise((resolve, reject) => {

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

							axios.request(options).then(function(response) {
								// console.log(response);
								screenshots.push(response.data);
								resolve(response.data);
							}).catch(function(error) {
								reject(error);
								console.error(error);
							});

						});
					});
				}

				sequences.then(items => {
					console.log(items);
					// console.log(screenshots);
					const words = new Array();
					const text = new Array();
					screenshots.forEach(s => {
						s.regions.forEach(r => {
							r.lines.forEach(l => {
								// console.log(l.words);
								words.push(l.words);
							});
						});
					});

					words.forEach(w => {
						w.forEach(word => {
							text.push(word.text);
						});
					});


					const exclude = [
						'FRIEND',
						'REQUESTS',
						'Today',
						'Sent',
						'you',
						'a',
						'Friend',
						'Request',
						'ACCEPT',
						'DELETE',
						'Request!',
						'*',
					];

					const regex = new RegExp(/^[A-Za-z0-9]+$/);
					const difference = text
						.filter(x => !exclude.includes(x))
						.filter(x => x.length > 3)
						.filter(x => regex.test(x));
					console.log(difference);
					if(difference.length > 0) {
						const trainerString = difference.join(', ');
						message.channel.send(trainerString);
					}

				}).catch(err => {
					console.log(err);
				});

			}

		})();
	},
};
