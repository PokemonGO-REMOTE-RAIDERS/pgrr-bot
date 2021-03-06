module.exports = {
	name: 'wh',
	description: 'Let a wave know which one is happening next.',
	execute(message, args) {

		async function getSpreadsheet(action, user, data) {

			// Google Sheets
			const { GoogleSpreadsheet } = require('google-spreadsheet');
			const sheetID = '1Ueq5Eh4aHcmabwmBQsvMt-xnsGgGC8OSw7a_hSI4ruk';
			const doc = new GoogleSpreadsheet(sheetID);

			await doc.useServiceAccountAuth({
				client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
				private_key: process.env.GOOGLE_PRIVATE_KEY,
			});

			await doc.loadInfo();
			const sheet = doc.sheetsByIndex[0];
			const rows = await sheet.getRows();

			let userInfo = false;

			for(const row of rows) {
				if(row.userid == user) {
					userInfo = row;
				}
			}

			if(!userInfo) {
				message.channel.send(`No data found for this Wave Host. Maybe consider using \`!wh set ${data}\` and add yourself to our on going list of wave hosts!`);
				return;
			}

			let response;
			if(action == 'get') {
				if(data == 'ign') {
					response = userInfo.ign;
				}
				else if(data == 'tc') {
					response = userInfo.tc;
				}
				else if(data == 'location') {
					response = userInfo.location;
				}
				else if(data == 'userid') {
					response = userInfo.userid;
				}
				else if(data == 'rules') {
					response = userInfo.rules;
				}
				if(response) {
					message.channel.send(response);
				}
				else {
					message.channel.send(`No data found for this Wave Host. Maybe consider using \`!wh set ${data}\` and add yourself to our on going list of wave hosts!`);
				}
			}
			else if(action == 'host') {

				const embed = {
					color: 0xf3619f,
					title: `A new wave with ${userInfo.ign}`,
					description: `Get your surf on with this super fun host in ${userInfo.location}`,
					fields: [
						{ name: 'My Rules', value: userInfo.rules },
						{ name: 'Number of Times Hosts', value: userInfo.hosts, inline: true },
						{ name: 'Trainer Code', value: userInfo.tc, inline: true },
					],
				};
				message.channel.send({ embed: embed });
			}


		}

		const action = args[0];
		const data = args[1];
		const user = message.author.id;

		if(action == 'get' || action == 'host') {
			getSpreadsheet(action, user, data).then().catch(console.error);
		}
		else {
			message.channel.send('Please check your arguments.');
		}

	},
};
