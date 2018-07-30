# Condition-Bot
A CoD bot for listing information about conditions

Commands to the bot must be started with its command prefix (defaults to !) or by mentioning the bot with an @ mention. For example to find the Pure Condition, you could enter either

`!condition Pure`  
or  
`@ConditionBot condition Pure`

##Commands:

### A note on command arguments
Command arguments for all commands regarding categories and roles are case sensitive. This is a baked into discord's architecture. While category names in Discord's server architecture are *stored* in a case sensitive format, they are *displayed* in all caps. Which means that if you name a category IC Rooms, it will show up as IC ROOMS, but trying to add the category IC ROOMS to the authorised rooms will not work.  

### Command list

condition [name of condition with spaces]
Fetches the details about the conditions and replies in channel, if permitted.

setCommandPrefix [new prefix]
Sets the command prefix to whatever character follows. This is an elevated operation.

addCategory [category of rooms]
The bot does not respond to any channels unless they are in a category that has been added to this list. This is an elevated operation.

removeCategory [category of rooms]
Remove a category of rooms from the list of permitted rooms. This is an elevated operation.

elevateRoll [name of role]
Adds a role to the list of roles that can perform elevated operations. This is an elevated operation.

deElevateRoll [name of role]
Remove a role from the list of roles that can perform elevated rolls. The server owner cannot be removed from this list, though any rolls they belong to can.


Adding the bot to your server can be done by following [this link](https://discordapp.com/api/oauth2/authorize?client_id=471711316021870605&permissions=11264&scope=bot)

By default, the bot has the permission to see categories and read messages (which are needed) as well as to manage messages. This last one is to allow the bot to delete commands that invoke it from the chat log. Which is how I generally configure it. You can uncheck the box in the above link to withold that permission without effecting the bot's effectiveness.