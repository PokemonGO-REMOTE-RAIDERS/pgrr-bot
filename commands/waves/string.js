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

				// THIS IS TERRIBLE....
				// TODO: MUST FIX SOMEHOW
				sequences.then(items => {

					// I hate lintcompile warnings so I'm dumping these.
					// console.log(items);

					const words = new Array();
					const text = new Array();
					screenshots.forEach(s => {
						s.regions.forEach(r => {
							r.lines.forEach(l => {
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
						'Yesterday',
						'Sent',
						'Friend',
						'Request',
						'ACCEPT',
						'DELETE',
						'Request!',
						'oday',
						'ACCE',
						'ACCEP',
						'iend',
						'toda',
					];

					// console.log(text);

					const regex = new RegExp(/^[A-Za-z0-9]+$/);
					const stringNames = text
						// exlude the exclusion array
						.filter(elem => !exclude.includes(elem))
						// exlude anything smaller than 3 charaters
						.filter(elem => elem.length > 3)
						// exlude special characters
						.filter(elem => regex.test(elem))
						// duplicates check
						.filter((elem, index, self) => {
							return index === self.indexOf(elem);
						});

					if(stringNames.length > 0) {
						const trainerNames = [];
						stringNames.forEach(name => {
							const ign = new String(name);
							trainerNames.push(ign.toLowerCase().substr(0, 5));
						});
						const trainerString = trainerNames.join(', ');
						message.channel.send(trainerString);
					}

				}).catch(err => {
					console.log(err);
				});

			}

		})();
	},
};
