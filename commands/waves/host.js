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
				const embed = {
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
							value: response.location,
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
							value: response.rules,
							inline: false,
						},
					],
					timestamp: new Date(),
					footer: {
						text: 'If you have questions, please tag @manager',
					},
				};
				message.channel.send({ embed: embed });
				message.channel.send(response.tc);


				setUserInfo(0, user, 'hosts', parseInt(response.hosts) + 1)
					.then().catch((error) => console.log(error));
			})
			.catch((error) => {
				console.log(error, `userid: ${user}`);
				message.channel.send(`No data found for this user. Maybe consider using \`${process.env.prefix}set\` and add yourself!`);
			});

	},
};