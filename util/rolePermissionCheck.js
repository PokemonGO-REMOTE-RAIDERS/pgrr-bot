// const Discord = require('discord.js');
const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async function rolePermissionCheck(message, command) {

	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	await doc.loadInfo();

	const sheet = doc.sheetsByIndex[process.env.sheetIndexConfig];
	const rows = await sheet.getRows();

	const allowedRoles = [];
	for(const role of command.roles) {

		const allowedRole = rows.find(row => row.config == role);
		allowedRole.value.trim().split(',').forEach(e => allowedRoles.push(e));

	}

	let response = false;
	for(const allowedRole of allowedRoles) {
		if(message.member.roles.cache.has(allowedRole)) {
			response = true;
		}
	}

	return response;

};