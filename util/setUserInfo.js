/**
 * @param {*} sheetIndex Set the index of the sheet you want to return.
 * @param {*} user The id of the user you're looking up.
 * @param {*} columnIndex target the column of data that we need to set.  The main command will tell us where to go based on it's.
 * @param {*} value the value of data do you need to set for the user.
 */
const ms = require('ms');
module.exports = async function setUserInfo(sheetIndex, user, data, value) {

	// Setup
	this.sheetIndex = sheetIndex;
	this.user = user;
	this.data = data;
	this.value = value;
	let response;

	// const isObject = (obj) => {
	// 	return Object.prototype.toString.call(obj) === '[object Object]';
	// };

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

	if(!userInfo) {
		const newUser = {};
		newUser.userid = this.user.id;
		newUser[this.data] = this.value;
		if(this.sheetIndex == 0) {
			newUser['hosts'] = 0;
			newUser['maxwaves'] = 0;
			newUser['timer'] = 0;
		}
		const addNewUser = await sheet.addRow(newUser);
		await addNewUser.save();

		response = {
			embed: {
				author: {
					name: `WaveHost ${this.user.name} Created`,
					icon_url: '',
				},
				color: '#f1609f',
				title: 'Welcome to the PGRR WaveHost Team!',
				description: `${this.data} is set to ${this.value}`,
			},
		};
	}
	else {
		// THIS DOESN'T WORK FOR SOME REASON, FIGURE IT OUT!

		userInfo[this.data] = this.value;

		await userInfo.save();

		if(data == 'timer') {
			this.value = ms(this.value);
		}
		const name = this.user.name ? this.user.name : this.user.username;
		response = {
			embed: {
				color: '#f1609f',
				author: {
					name: `${name} Information Updated`,
					icon_url: '',
				},
				title: this.data.charAt(0).toUpperCase() + this.data.slice(1),
				description: this.value,
			},
		};
	}

	return await response;

};