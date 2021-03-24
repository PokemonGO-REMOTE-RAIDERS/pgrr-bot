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

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	await doc.loadInfo();

	const sheet = doc.sheetsById[this.sheetIndex];
	const rows = await sheet.getRows();


	let userInfo = false;
	for(const row of rows) {
		if(row.userid == this.user.id) {
			userInfo = row;
		}
	}

	if(!userInfo) {
		return false;
	}
	else if(this.data == 'row') {
		response = userInfo;
	}
	else {
		response = userInfo[data];
	}

	return await response;

};