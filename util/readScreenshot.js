module.exports = async function readScreenshot(attachmentUrl) {

	if(!attachmentUrl) {
		return;
	}

	const axios = require('axios').default;

	// const attachments = message.attachments.array();

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
			url: attachmentUrl,
		},
	};

	// console.log(options);

	axios.request(options).then(function(response) {
		// console.log(response);
		return response.data;
	}).catch(function(error) {
		console.error(error);
	});

};