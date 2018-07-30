# Condition-Bot
A CoD bot for listing information about conditions

Commands to the bot must be started with its command prefix (defaults to !) or by mentioning the bot with an @ mention. For example to find the Pure Condition, you could enter either

`!condition Pure`  
or  
`@ConditionBot condition Pure`

Commands:
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
