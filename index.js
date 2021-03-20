// Config
const dotenv = require('dotenv');
dotenv.config();
const prefix = process.env.prefix;
const discordToken = process.env.token;

// Discord JS
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();


// Utilities
const validateArguments = require('./util/validateArguments.js');
const expectedArguments = require('./util/expectedArguments.js');
const rolePermissionCheck = require('./util/rolePermissionCheck.js');
const cooldown = require('./util/cooldown.js');


// Get all of the commands
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// Find all commands that have no prefix.
const noPrefixes = [];
for(const cmds of client.commands) {
	if(cmds.find(cmd => cmd.noPrefix)) {
		const command = cmds.find(cmd => cmd.noPrefix);
		noPrefixes.push(command.name);
	}
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('PokemonGO every day.', { type: 'PLAYING' });
});

client.on('message', message => {
	(async function() {
		let noPrefix = false;
		let args = '';
		for (const noPrefixCommand of noPrefixes) {
			if(noPrefix) { break; }
			if (message.content.toLowerCase().startsWith(noPrefixCommand)) {
				noPrefix = true;
			}
		}

		if (noPrefix && !message.author.bot) {
			args = message.content.trim().split(/ +/);

		}
		else if (!message.content.startsWith(prefix) || message.author.bot) {
			return;
		}

		if (!noPrefix) {
			// args = message.content.slice(prefix.length).trim().split(/ +/);
			args = message.content.slice(prefix.length).trim().replace(/\n/g, ' ').split(' ');
		}

		const commandName = args.shift().toLowerCase();

		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;


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
			const roleCheck = await rolePermissionCheck(message, command);
			if(!roleCheck) {
				return message.reply('You do not have permissions to do this!');
			}
		}

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		args = expectedArguments(message, commandName, noPrefix, command, args);

		const validArgs = validateArguments(message, command, args);

		if(!validArgs) {
			return;
		}

		args = validArgs;

		const isCooldown = cooldown(cooldowns, command, message, Discord);
		if(isCooldown) {
			return;
		}

		try {
			command.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}());
});

client.login(discordToken);
