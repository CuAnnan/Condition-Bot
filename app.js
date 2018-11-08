const Discord = require('discord.js');
const client = new Discord.Client();
const conf = require('./conf.js');
const bot = require('./ConditionBot.js');
const MongoClient = require('mongodb');

function listen()
{
	client.on(
		'message',
		function(message)
		{
			try
			{
				if (message.author.bot)
				{
					return;
				}
				bot.processCommand(message);
			}
			catch(e)
			{
				console.warn(e);
			}
		}
	);
}

client.login(conf.clientToken);

client.once(
	'ready',
	function()
	{
		console.log("Logged in as "+client.user.username+"!");
		
		MongoClient
			.connect(conf.mongoDB.getURI(), {useNewUrlParser: true})
			.then((mongoClient)=>{
				console.log('Hoisted database connection');
				let db = mongoClient.db(conf.mongoDB.db),
					collection = db.collection('conditions');
				bot.hoist(client.user, collection).then(
					()=>{
						console.log('Hoisted bot');
						listen();
					}
				);
			})
			.catch((err)=> {
				console.log(err);
			});
	}
);

process.on(
	'SIGINT',
	function()
	{
		console.log('Shutting down bot')
		bot.shutdown();
		console.log('Shutting down client');
		client.destroy();
		console.log('Shutting down app');
		process.exit();
	}
);

process.on('unhandledRejection', console.error);
console.log('Starting');