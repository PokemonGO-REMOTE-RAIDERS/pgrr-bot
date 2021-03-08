/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} columnIndex target the column of data that we need to set.  The main command will tell us where to go based on it's.
 * @param {*} value the value of data do you need to set for the user.
 */
module.exports = async function setUserInfo(sheetIndex, user, data, value) {

	// Setup
	this.sheetIndex = sheetIndex;
	this.user = user;
	this.data = data;
	this.value = value;
	let response;

	const dotenv = require('dotenv');
	dotenv.config();

	// Google Sheets
	const { GoogleSpreadsheet } = require('google-spreadsheet');
	const sheetID = '1Ueq5Eh4aHcmabwmBQsvMt-xnsGgGC8OSw7a_hSI4ruk';
	const doc = new GoogleSpreadsheet(sheetID);

	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	await doc.loadInfo();

	const sheet = doc.sheetsByIndex[this.sheetIndex];
	const rows = await sheet.getRows();

	let userInfo = false;

	// Check to make sure a user exists
	for(const row of rows) {
		if(row.userid == this.user) {
			userInfo = row;
		}
	}

	if(!userInfo) {
		const newUser = {};
		newUser.userid = this.user;
		newUser[this.data] = this.value;
		const addNewUser = await sheet.addRow(newUser);
		await addNewUser.save();

		response = {
			embed: {
				color: '#f1609f',
				title: 'New user created',
				description: `${data} is set to ${this.value}`,
			},
		};
	}
	else {
		userInfo[this.data] = this.value;
		await userInfo.save();
		response = {
			embed: {
				color: '#f1609f',
				title: `${data} updated`,
				description: this.value,
			},
		};
	}

	return await response;

};