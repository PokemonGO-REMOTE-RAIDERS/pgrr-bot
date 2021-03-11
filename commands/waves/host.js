const getUserInfo = require('../../util/getUserInfo.js');
const setUserInfo = require('../../util/setUserInfo.js');
module.exports = {
	name: 'host',
	description: 'Post a host\'s card',
	expectedArgs: 0,
	args: false,
	execute(message) {
		const data = 'row';
		const user = message.author.id;
		getUserInfo(0, user, data)
			.then((response) => {
				let embed;
				if(!response.tc || !response.ign) {
					const tc = response.tc ? response.tc : 'not set';
					const ign = response.ign ? response.ign : 'not set';
					embed = {
						title: 'Please ensure you\'ve set both IGN and TC as both are requried',
						fields: [
							{
								name: 'TC',
								value: tc,
							},
							{
								name: 'IGN',
								value: ign,
							},
						],
					};
				}
				else {

					embed = {
						color: '#f1609f',
						title: `Wavehost: ${response.ign}`,
						description: `<@&818325677492797460> Hop on board and ride the wave with ${response.ign}`,
						author: {
							name: 'PokémonGO Remote Raiders',
							icon_url: 'https://raw.githubusercontent.com/PokemonGO-REMOTE-RAIDERS/pgrr-triple-threat/main/assets/pgrr-logo.png',
						},
						fields: [
							{
								name: 'IGN',
								value: response.ign,
								inline: true,
							},
							{
								name: 'Location',
								value: response.location ? response.location : 'Not set',
								inline: true,
							},
							{
								name: 'Number of Hosts',
								value: response.hosts,
								inline: true,
							},
							{
								name: 'Wave Record',
								value: response.maxwaves,
								inline: true,
							},
							{
								name: 'Rules',
								value: response.rules ? response.rules : 'Not set',
								inline: false,
							},
						],
						timestamp: new Date(),
						footer: {
							text: 'If you have questions, please tag @manager',
						},
					};
				}
				message.channel.send({ embed: embed });

				if(response.tc) {
					message.channel.send(response.tc).then((sent) => {

						const dataSend = {
							hosting: 'true',
							tcmessageid: sent.id,
							hosts: parseInt(response.hosts) + 1,
						};

						setUserInfo(0, user, 'tcmessageid', dataSend.tcmessageid).then(() => {
							setUserInfo(0, user, 'hosting', dataSend.hosting).then(() => {
								setUserInfo(0, user, 'hosts', dataSend.hosts).then().catch();
							}).catch();
						}).catch();

						function deleteMsg() {
							sent.delete();
						}

						if(response.timer > 0) {
							setTimeout(deleteMsg, response.timer);
						}
					});
				}
			})
			.catch((error) => {
				console.log(error, `userid: ${user}`);
				message.channel.send(`No data found for this user. Maybe consider using \`${process.env.prefix}set\` and add yourself!`);
			});

	},
};