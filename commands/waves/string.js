module.exports = {
	name: 'string',
	aliases: [ 'ss', 'screenshot', 'stringme', 'stringify'],
	description: 'Takes a screenshot and returns a comma separated string of trainernames that are truncated to 5 characters and lowercase.  Must be used on a screenshot of the Friend Request screen in PoGo.',
	config: 'wavehost',
	cooldown: 5,
	roles: ['roleWaveHost', 'roleAdmin'],
	execute(message) {
		(async function() {

			const axios = require('axios').default;

			// Get attachments
			const attachments = message.attachments.array();


			if(attachments.length > 0) {

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

					// Setup an exclusion based on common words on the PoGo Friend Request Screen.
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

					// Ignore anything that has a special character
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

					// Ensure there are elements in the array
					if(stringNames.length > 0) {

						const trainerNames = new Array();

						// Convert all names to lowercase
						stringNames.forEach(name => {
							const ign = new String(name);
							trainerNames.push(ign.toLowerCase().substr(0, 5));
						});

						// Convert array to string.
						const trainerString = trainerNames.join(', ');

						// Send the string to channel
						message.channel.send(trainerString);
					}

				}).catch(err => {
					console.log(err);
					message.channel.send('<@310756994044657674>, an error occured while processing. WaveHost please add this to <#826286040657559622>');
				});

			}

		})();
	},
};
