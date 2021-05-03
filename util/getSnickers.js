/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} data which data do you need to return from that user.
 */
module.exports = async function getSnickers(workbookID, sheetID, snickerChannel, data) {

	// Setup
	this.sheetID 		= sheetID;
	this.snickerChannel = snickerChannel;
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
	const snickerArray = new Array();
	let snicker = false;
	for(const row of rows) {
		if(row.snickerChannel == this.snickerChannel) {
			snicker = row;
			snickerArray.push(row);
		}
	}

	// If no user back out
	if(!snicker) {
		return false;
	}

	// Send back all of the rows
	else if(this.data == 'array') {
		response = snickerArray;
	}

	// Send back the first full row if requested
	else if(this.data == 'row') {
		response = snicker;
	}

	// Otherwise send back just that one data point.
	else {
		response = snicker[data];
	}

	// Wait for response to be set before sending.
	return await response;

};