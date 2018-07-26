let DiscordBot = require('./DiscordBot'),
	settingsToHoist = ['roomCategoriesToRespondTo', 'rolesWithBotAdminPower'];

class ConditionBot extends DiscordBot
{
	constructor()
	{
		super();
		this.db = null;
		this.roomCategoriesToRespondTo = {};
		this.rolesWithBotAdminPower = {};
	}
	
	async hoist(user, collection)
	{
		let settings = await super.hoist(user);
		
		for(let setting of settingsToHoist)
		{
			this[setting] = settings[setting]?settings[setting]:{};
		}
		
		this.collection = collection;
		
		this.attachCommands();
	}
	
	attachCommands()
	{
		super.attachCommands();
		this.attachCommand('condition', this.getCondition);
		this.attachCommand('elevateRole', this.elevateRole);
		this.attachCommand('deElevateRole', this.deElevateRole);
		this.attachCommand('addCategory', this.addCategory);
		this.attachCommand('removeCategory', this.removeCategory);
	}
	
	getSettingsToSave()
	{
		let settingsToSave = super.getSettingsToSave();
		
		for(let setting of settingsToHoist)
		{
			settingsToSave[setting] = this[setting];
		}
		
		return settingsToSave;
	}
	
	checkPermissions(message)
	{
		if(message.guild.owner.id == message.author.id)
		{
			return true;
		}
		
		let userRoles = message.member.roles.array();
		for(let role of userRoles)
		{
			if(this.isElevatedRoleForGuild(role, message.guild))
			{
				return true;
			}
		}
		
		return false;
	}
	
	elevateCommand(message)
	{
		if(!this.checkPermissions(message))
		{
			throw new Error('This action is only allowable by the server owner')
		}
	}
	
	getRoleIdByGuildAndName(guild, name)
	{
		let role = guild.roles.find('name', name);
		if(!role)
		{
			return null;
		}
		return role.id;
	}
	
	isElevatedRoleForGuild(role, guild)
	{
		if(!this.rolesWithBotAdminPower[guild.id])
		{
			return false;
		}
		return this.rolesWithBotAdminPower[guild.id].indexOf(role.id) >= 0;
	}
	
	elevateRole(commandParts, message)
	{
		this.elevateCommand(message);
		let roleName = commandParts.join(' ');
		let roleId = this.getRoleIdByGuildAndName(message.guild, roleName);
		if(!roleId)
		{
			message.reply('Could not find a role named '+roleName+'. Role names are Case Specific');
			return;
		}
		this.rolesWithBotAdminPower[message.guild.id] = this.rolesWithBotAdminPower[message.guild.id]?this.rolesWithBotAdminPower[message.guild.id]:[];
		if(this.rolesWithBotAdminPower[message.guild.id].indexOf(roleId) >= 0)
		{
			message.reply('Role '+roleName+' is already privileged with this bot');
			return;
		}
		this.rolesWithBotAdminPower[message.guild.id].push(roleId);
		this.saveSettings();
	}
	
	deElevateRole(commandParts, message)
	{
		let roleName = commandParts.join(' ');
		let roleId = this.getRoleIdByGuildAndName(message.guild, roleName);
		if(!roleId)
		{
			message.reply('Could not find a role named '+roleName+'. Role names are Case Specific');
			return;
		}
		
		if(!this.rolesWithBotAdminPower[message.guild.id])
		{
			return;
		}
		
		let roleIndex = this.rolesWithBotAdminPower[message.guild.id].indexOf(roleId);
		if(roleIndex < 0)
		{
			message.reply(roleName+' is not privileged with this bot');
			return;
		}
		this.rolesWithBotAdminPower[message.guild.id].splice(roleIndex, 1);
		this.saveSettings();
	}
	
	getCategoryIdByGuildAndName(guild, name)
	{
		let category = guild.channels.find('name', name);
		if(!category)
		{
			return null;
		}
		return category.id;
	}
	
	addCategory(commandParts, message)
	{
		this.elevateCommand(message);
		let categoryName = commandParts.join(' ');
		let categoryId = this.getCategoryIdByGuildAndName(message.guild, categoryName);
		if(!categoryId)
		{
			message.reply("No category was found with the name "+categoryName);
			return;
		}
		this.roomCategoriesToRespondTo[message.guild.id] = this.roomCategoriesToRespondTo[message.guild.id]?this.roomCategoriesToRespondTo[message.guild.id]:[];
		this.roomCategoriesToRespondTo[message.guild.id].push(categoryId);
		this.saveSettings();
	}
	
	removeCategory(commandParts, message)
	{
		this.elevateCommand(message);
		let categoryName = commandParts.join(' ');
		let categoryId = this.getCategoryIdByGuildAndName(message.guild, categoryName);
		if(!categoryId)
		{
			message.reply("No category was found with the name "+categoryName);
			return;
		}
		
		if(!this.roomCategoriesToRespondTo[message.guild.id])
		{
			return;
		}
		
		let categoryIndex = this.roomCategoriesToRespondTo[message.guid.id].indexOf(categoryId);
		if(categoryIndex < 0)
		{
			return;
		}
		this.roomCategoriesToRespondTo[message.guild.id].splice(categoryIndex, 1);
		this.saveSettings();
	}
	
	
	async getCondition(commandParts, message)
	{
		let category = message.channel.parent;
		if (category)
		{
			let categoryId = category.id, guildId = message.guild.id;
			if(this.roomCategoriesToRespondTo[guildId] && this.roomCategoriesToRespondTo[guildId].indexOf(categoryId) >= 0)
			{
				let conditionSearch = commandParts.join(' ').toLowerCase(),
					channelNameLC = category.name.toLowerCase(),
					search = await this.collection.find({searchKey: conditionSearch}).toArray();
				for (let result of search)
				{
					message.reply(this.formatCondition(result));
				}
			}
		}
	}
	
	formatCondition(condition)
	{
		let keysToAutomate = ['Description', 'Effect', 'Resolution', 'Beat', 'Source'],
			parts = [
			'**Name:** ' + (condition.Name + (condition.Persistent?' ('+condition.Persistent+')':''))
		];
		for(let key of keysToAutomate)
		{
			if(condition[key])
			{
				parts.push(`**${key}:** ${condition[key]}`);
			}
		}
		return parts;
	}
}

module.exports = new ConditionBot();