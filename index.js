(async function() {

	// process.env Config
	const dotenv = require('dotenv');
	dotenv.config();

	// Discord JS
	const discordToken = process.env.token;
	const Discord = require('discord.js');
	const client = new Discord.Client();
	client.commands = new Discord.Collection();

	// Bot Configuration
	const botConfig = require('./util/configSetup.js');

	// Get all of the config files ON LOAD to reduce database checks
	// NOTE: This means if the config file changes we MUST restart Dynos.
	client.config = new Array();
	client.config['wavehost'] 	= await botConfig(process.env.workbookWavehost, process.env.sheetWaveConfig).catch(error => console.log(error));
	client.config['bx'] 		= await botConfig(process.env.workbookBX, process.env.sheetBXConfig).catch(error => console.log(error));
	client.config['cd'] 		= await botConfig(process.env.workbookCD, process.env.sheetCDConfig).catch(error => console.log(error));

	console.log('Config loaded.');

	// Utilities
	const validateArguments = require('./util/validateArguments.js');
	const expectedArguments = require('./util/expectedArguments.js');
	const checkRoles = require('./util/checkRoles.js');
	const checkChannels = require('./util/checkChannels.js');
	const cooldown = require('./util/cooldown.js');


	// Get all of the commands
	const fs = require('fs');
	const commandFolders = fs.readdirSync('./commands');
	console.log(commandFolders);
	for (const folder of commandFolders) {
		const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
		
		for (const file of commandFiles) {
			const command = require(`./commands/${folder}/${file}`);
			if(command.include) {
				client.commands.set(command.name, command);
			}
		}
	}

	// Find all commands that have no prefix.
	const noPrefixes = new Array();
	for(const cmds of client.commands) {
		if(cmds.find(cmd => cmd.noPrefix)) {
			const command = cmds.find(cmd => cmd.noPrefix);
			noPrefixes.push(command.name);
		}
	}

	console.log('Commands loaded.');

	const winston = require('winston');
	const { createLogger, format, transports } = require('winston');
	const { combine, timestamp, prettyPrint } = format;

	const logger = createLogger({
		level: 'info',
		format: combine(
			winston.format.json(),
			timestamp(),
			prettyPrint(),
		),
		defaultMeta: {
			command: '',
			args: '',
		},
		timestamp: timestamp(),
		transports: [
			//
			// - Write all logs with importance level of `error` or less to `error.log`
			// - Write all logs with importance level of `info` or less to `combined.log`
			//
			new transports.Console(),
			new transports.File({ filename: 'error.log', level: 'error' }),
			new transports.File({ filename: 'combined.log' }),
		],
	});

	const cooldowns = new Discord.Collection();

	client.once('ready', () => {
		console.log('Ready and waiting...');
		client.user.setActivity('Made by the PGRR Dev Team.');
	});

	client.on('message', message => {
		(async function() {

			// console.log(message);

			// const member = message.guild.members.cache.get(message.author.id);

			// Establish Prefix
			client.prefix = process.env.prefix;

			let noPrefix = false;
			let args = '';
			// Loop
			for (const noPrefixCommand of noPrefixes) {
				if(noPrefix) { break; }
				if (message.content.toLowerCase().startsWith(noPrefixCommand)) {
					noPrefix = true;
				}
			}

			if (noPrefix && !message.author.bot) {
				args = message.content.trim().split(/ +/);

			} else if (!message.content.startsWith(client.prefix) || message.author.bot) {
				return;
			}

			if (!noPrefix) {
				// args = message.content.slice(prefix.length).trim().split(/ +/);
				args = message.content.slice(client.prefix.length).trim().replace(/\n/g, ' ').split(' ');
			}

			const commandName = args.shift().toLowerCase();

			const command = client.commands.get(commandName)
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return;


			// Set config for Prod or Dev based on the config file that the command uses.
			if(command.config) {
				client.config['guild'] = message.guild.id === client.config[command.config].production.guild ? client.config[command.config].production : client.config[command.config].development;
			}

			if (command.guildOnly && message.channel.type === 'dm') {
				return message.reply('I can\'t execute that command inside DMs!');
			}


			// console.log(authorPerms);
			if (command.permissions) {
				const authorPerms = message.channel.permissionsFor(message.author);
				if (!authorPerms || !authorPerms.has(command.permissions)) {
					return message.reply('You can not do this!');
				}
			}

			if(command.roles) {
				const roleCheck = checkRoles(client, message, command);
				if(!roleCheck) {
					return message.reply('You do not have permissions to do this!');
				}
			}

			if(command.channels) {
				const channelCheck = checkChannels(client, message, command.channels);
				if(!channelCheck) {
					return message.reply('This command can not be used in this channel!');
				}
			}

			if (command.args && !args.length) {
				let reply = `You didn't provide any arguments, ${message.author}!`;

				if (command.usage) {
					reply += `\nThe proper usage would be: \`${client.prefix}${command.name} ${command.usage}\``;
				}

				return message.channel.send(reply);
			}

			args = expectedArguments(message, commandName, noPrefix, command, args, client);

			const validArgs = validateArguments(message, command, args, client);

			if(!validArgs) {
				return;
			}

			args = validArgs;

			const isCooldown = cooldown(cooldowns, command, message, Discord);
			if(isCooldown) {
				return;
			}

			try {
				logger.defaultMeta.command = command.name;
				command.execute(message, args, client, logger);
			} catch (error) {
				console.error(error);
				message.reply('there was an error trying to execute that command!');
			}
		}());
	});

	client.login(discordToken);
})().catch(error => console.log(error));