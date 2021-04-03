/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} data which data do you need to return from that user.
 */

module.exports = async function getHistoricalWaves(user) {

	// Setup
	this.user = user;

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

	// Authorize with Google
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	// Get workbook information
	await doc.loadInfo();

	const sheet = doc.sheetsById[process.env.sheetWaveHistory];
	const rows = await sheet.getRows();


	const waveHistory = new Array();
	for(const row of rows) {
		if(row.userid == this.user.id) {
			waveHistory.push(row);
		}
	}

	if(!waveHistory) {
		return false;
	}
	else {
		return waveHistory;
	}


};