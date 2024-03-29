/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} data which data do you need to return from that user.
 */
module.exports = async function getUserInfo(workbookID, sheetID, user, data) {

	// Setup
	this.sheetID 		= sheetID;
	this.user 		= user;
	this.data 		= data;
	this.wookbookID 	= workbookID;
	let response;

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

	// console.log(rows, user);

	// Loop through the rows and pull back the user based on the Discord User ID
	let userInfo = false;
	let array = new Array();
	for(const row of rows) {
		if(row.userid == this.user.id) {
			userInfo = row;
			if(this.data == 'all' ) {
				array.push(row);
			}
		}
	}

	// If no user back out
	if(!userInfo) {
		return false;
	}

	// Send back the full row if requested
	else if(this.data == 'row') {
		response = userInfo;
	}

	// Send back the full row if requested
	else if(this.data == 'all' && array) {
		response = array;
	}

	// Otherwise send back just that one data point.
	else {
		response = userInfo[data];
	}

	// Wait for response to be set before sending.
	return await response;

};