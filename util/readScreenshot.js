module.exports = function readScreenshot(message) {

	if(!message.attachments) {
		return;
	}

	const axios = require('axios').default;

	const attachments = message.attachments.array();
	console.log(attachments);

	for(const attachment of attachments) {

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
				url: attachment.proxyURL,
			},
		};
		console.log(options);

		axios.request(options).then(function(response) {
			console.log(response.data);
		}).catch(function(error) {
			console.error(error);
		});
	}

};