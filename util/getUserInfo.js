/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} data which data do you need to return from that user.
 */
module.exports = async function getUserInfo(sheetIndex, user, data) {

	// Setup
	this.sheetIndex = sheetIndex;
	this.user = user;
	this.data = data;
	let response;

	const dotenv = require('dotenv');
	dotenv.config();

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const sheetID = '1Ueq5Eh4aHcmabwmBQsvMt-xnsGgGC8OSw7a_hSI4ruk';
	const doc = new GoogleSpreadsheet(sheetID);

	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY,
	});

	await doc.loadInfo();

	const sheet = doc.sheetsByIndex[this.sheetIndex];
	const rows = await sheet.getRows();

	let userInfo = false;

	for(const row of rows) {
		if(row.userid == this.user) {
			userInfo = row;
		}
	}

	if(!userInfo) {
		throw new Error(`No data found for this user. Maybe consider using \`${process.env.prefix}set \` and add yourself!`);
	}
	else {
		response = userInfo[data];
	}
	if(!response) {
		response = `No data, please use \`${process.env.prefix}set\``;
	}
	return await response;

};