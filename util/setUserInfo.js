/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} columnIndex target the column of data that we need to set.  The main command will tell us where to go based on it's.
 * @param {*} value the value of data do you need to set for the user.
 */
// const ms = require('ms');
module.exports = async function setUserInfo(sheetIndex, user, data, value, newRow) {

	// Setup
	this.sheetIndex = sheetIndex;
	this.user = user;
	this.data = data;
	this.value = value;
	this.newRow = newRow;
	// let response;

	const isObject = (obj) => {
		return Object.prototype.toString.call(obj) === '[object Object]';
	};

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	await doc.loadInfo();

	const sheet = doc.sheetsByIndex[this.sheetIndex];
	const rows = await sheet.getRows();


	// Check to make sure a user exists
	let userInfo = false;
	for(const row of rows) {
		if(row.userid == this.user.id) {
			userInfo = row;
		}
	}

	if(newRow && isObject(this.data)) {

		const addNewUser = await sheet.addRow(this.data);
		await addNewUser.save();

		// response = true;
	}
	else {

		userInfo[this.data] = this.value;

		await userInfo.save().then((rsp) => {
			if(rsp) {
				console.log(rsp);
			}
		});

	}

	// return await response;

};