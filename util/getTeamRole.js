module.exports = function getTeamRole(message, client) {

	if(message.member.roles.cache.has(client.config.guild.roleMystic)) {
		return 'Mystic';
	}
	else if(message.member.roles.cache.has(client.config.guild.roleValor)) {
		return 'Valor';
	}
	else {
		return 'Instinct';
	}

};

