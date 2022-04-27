const patreon = require('patreon');
const patreonAPI = patreon.patreon;

const checkMentions = require('../../util/checkMentions.js');

const patreonClientToken = process.env.PATREON_TOKEN;
const patreonCampaignID = process.env.PATREON_CAMPAIGN_ID;

const isObject = (obj) => {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

const capitalize = (str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = {
	include: false,
	name: 'patreon',
	aliases: ['patreon', 'patron', 'patroen', 'partreon'],
	description: '',
	expectedArgs: 2,
	config: 'wavehost',
	roles: ['roleAdmin'],
	execute(message, args, client, logger) {
		console.log(message);

		const endpoint = args[0];
		const email = args[1];
		const mentions = checkMentions(message, args);
		console.log(mentions);
		const patreonClient = patreonAPI(patreonClientToken);

		return patreonClient(
			`campaigns/${patreonCampaignID}/pledges?page%5Bcount%5D=10000`,
		)
			.then(({ store }) => {
				const users = store.findAll('user');

				/**
				 *
				 * List Patreon users and their Discord accounts if they're synced.
				 *
				 */
				if (endpoint == 'list') {
					let listUsers = String();
					let noDiscord = String();

					users.forEach((user) => {
						console.log(user);

						if (user.social_connections.discord !== null) {
							listUsers += `<@${user.social_connections.discord.user_id}>\n`;
						} else {
							noDiscord += `${user.full_name}\n `;
						}
					});

					if (!listUsers) {
						return message.channel.send('No patrons found.');
					}

					if (noDiscord) {
						message.channel.send(`Discord Not Synced for:\n ${noDiscord}`);
					}

					return message.channel.send(listUsers);
				}

				/**
				 *
				 * Get the details for a specific user
				 *
				 */
				if (endpoint == 'details' && mentions.user) {
					let details;

					users.forEach((user) => {
						if (
							(mentions.user &&
								user.social_connections.discord &&
								mentions.user.id == user.social_connections.discord.user_id) ||
							(endpoint == 'email' && email == user.email)
						) {
							details = user;
						}
					});

					const userReply = mentions.user ? `<@${mentions.user.id}>` : email;

					if (!details) return message.channel.send(`${userReply} is not a patron.`);

					const embed = {
						color: client.config.guild.embedColor,
						title: 'Patreon Information',
						description: `${userReply}`,
						author: {
							name: client.config.guild.botName,
							icon_url: client.config.guild.botIcon,
						},
						fields: [],
						timestamp: new Date(),
					};

					details._attributes.forEach((_attr) => {
						// console.log(`${_attr}: ${details[_attr]}`);

						const attr = new String(_attr);
						let detail = details[_attr];

						if (
							detail !== null &&
							detail !== '' &&
							!isObject(detail) &&
							!Array.isArray(detail) &&
							_attr !== 'gender'
						) {
							console.log(detail);

							if (typeof detail == 'boolean') {
								detail = detail ? 'Yes' : 'No';
							}

							if (attr == 'thumb_url') {
								embed.thumbnail = {
									url: detail,
								};
							}

							embed.fields.push({
								name: attr.split('_').map(capitalize).join(' '),
								value: detail,
								// inline: true,
							});
						}
					});

					console.log(embed);

					return message.channel.send({ embed: embed });
				}

				/**
				 *
				 * Check if a Patreon user exists
				 *
				 */
				if (mentions.user || endpoint == 'email') {
					let userExists = false;
					let noDiscord = false;

					users.forEach((user) => {
						// console.log(user);
						if (
							(mentions.user &&
								user.social_connections.discord &&
								mentions.user.id == user.social_connections.discord.user_id) ||
							(endpoint == 'email' && email == user.email)
						) {
							userExists = true;

							if (user.social_connections.discord == null) {
								noDiscord = true;
							}
						}
					});

					const userReply = mentions.user ? `<@${mentions.user.id}>` : email;

					if (!userExists) {
						return message.channel.send(`${userReply} is not a patron.`);
					}

					if (noDiscord) {
						return message.channel.send(
							`${userReply} is a patron, but has not synced Discord.`,
						);
					}

					return message.channel.send(`${userReply} is a patron.`);
				}
			})
			.catch((error) => {
				logger.log({ level: 'error', message: error });
				return message.channel.send(
					'An error occured while trying to retrieve the list of patrons.',
				);
			});
	},
};
