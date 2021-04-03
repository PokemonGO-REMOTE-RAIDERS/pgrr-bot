const { GoogleSpreadsheet } = require('google-spreadsheet');

/**
 *
 * This function gets a config information from a Google Sheet
 *
 * @param {*} workbookID The workbookID value
 * @param {*} sheetID The sheetID value
 * @returns
 */

module.exports = async function botConfig(workbookID, sheetID) {

	const config = {
		production: {},
		development: {},
	};

	const doc = new GoogleSpreadsheet(workbookID);
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	});

	await doc.loadInfo();

	const sheet = doc.sheetsById[sheetID];
	const rows = await sheet.getRows();

	for(const row of rows) {

		if(row.type == 'array') {
			config.development[row.config] 	= row.development.trim().split(', ');
			config.production[row.config] 	= row.production.trim().split(', ');
		}

		if(row.type == 'string') {
			config.development[row.config] 	= row.development.trim();
			config.production[row.config] 	= row.production.trim();
		}
	}

	return config;


};