/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} data which data do you need to return from that user.
 */
module.exports = async function get8Balls(workbookID, sheetID) {

	// Setup
	this.sheetID 		= sheetID;
	this.wookbookID 	= workbookID;
	// let response;

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const doc = new GoogleSpreadsheet(this.wookbookID);

	// Authorize with Google
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	// Get workbook information
	await doc.loadInfo();

	// Grab the proper sheet
	const sheet = doc.sheetsById[this.sheetID];
	const rows = await sheet.getRows();

	// Loop through the rows and pull back the user based on the Discord User ID
	// let userInfo = false;

	const general = Array();
	const bxResponses = Array();
	const bxRooms = Array();

	rows.forEach((row) => {
		if(row.general !== '' && row.general !== undefined && row.general !== null && row.general !== 'undefined') {
			general.push(row.general);
		}
		if(row.bxResponses !== '' && row.bxResponses !== undefined && row.bxResponses !== null && row.bxResponses !== 'undefined') {
			bxResponses.push(row.bxResponses);
		}
		if(row.bxRooms !== '' && row.bxRooms !== undefined && row.bxRooms !== null && row.bxRooms !== 'undefined') {
			bxRooms.push(row.bxRooms);
		}
	});

	const response = {
		general: general,
		bxResponses: bxResponses,
		bxRooms: bxRooms,
	};

	return response;

	// If no user back out
	// if(!response) {
	// 	return false;
	// }

	// Send back the full row if requested
	// else if(this.data == 'row') {
	// 	response = userInfo;
	// }

	// Otherwise send back just that one data point.
	// else {
	// 	response = userInfo[data];
	// }

	// Wait for response to be set before sending.
	// return await response;

};