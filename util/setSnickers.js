/**
 * @param {number} sheetId Set the id of the sheet you want to return.
 * @param {Object} user The id of the user you're looking up.
 * @param {*} data target the column of data that we need to set.  The main command will tell us where to go based on it's.
 * @param {string, null} value the value of data do you need to set for the user.
 * @param {boolean} newRow bool that sets a new row
 */
// const ms = require('ms');
module.exports = async function setUserInfo(workbookID, sheetID, snickerChannel, data, value, newRow) {

	// Setup
	this.sheetID		= sheetID;
	this.snickerChannel = snickerChannel;
	this.data 		= data;
	this.value 		= value;
	this.newRow 		= newRow;
	this.wookbookID 	= workbookID;

	const isObject = (obj) => {
		return Object.prototype.toString.call(obj) === '[object Object]';
	};

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const doc = new GoogleSpreadsheet(this.wookbookID);

	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	await doc.loadInfo();

	const sheet = doc.sheetsById[this.sheetID];
	const rows = await sheet.getRows();

	// Check to make sure a user exists
	let snicker = false;
	let response = false;

	for(const row of rows) {
		if(row.snickerChannel == this.snickerChannel) {
			snicker = row;
		}
	}

	// console.log(userInfo);

	// New User
	if(this.newRow && isObject(this.data)) {

		const addNewUser = await sheet.addRow(this.data);
		await addNewUser.save();

		response = true;

	}

	// Process an array of data
	else if(snicker && Array.isArray(data)) {

		for(const newData of this.data) {

			snicker[newData.data] = newData.value;

			await snicker.save();

		}

		response = true;

	}

	// Process a single value
	else if(snicker) {

		snicker[this.data] = this.value;
		// console.log(this.value);
		await snicker.save();

		response = true;
	}

	return response;

};