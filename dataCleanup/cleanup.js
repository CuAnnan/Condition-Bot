let fs = require('fs'),
	file = fs.readFileSync('./phase1Data.txt', 'utf8'),
	lines = file.split('\n'),
	keys = ['Name', 'Persistent', 'Description', 'Source', 'Resolution', 'Beat', 'Effect'],
	conditionsJSON = [],
	conf = require('../conf.js'),
	MongoClient = require('mongodb');
// don't care about the first line, it's the titles
lines.shift();
for(let line of lines)
{
	line = line.trim();
	if(line)
	{
		let lineParts = line.split('\t'),
			searchKey = lineParts[0].toLowerCase(),
			object = {
				searchKey:searchKey
			};
		
		for (let i = 0; i < lineParts.length; i++)
		{
			if(lineParts[i])
			{
				let key = keys[i];
				object[key] = lineParts[i];
			}
		}
		if(object.Persistent)
		{
			object.Persistent = object.Persistent == '●'?'Persistent':'Optionally Persistent';
		}
		
		conditionsJSON.push(object)
	}
}

fs.writeFileSync('./conditions.json', JSON.stringify(conditionsJSON, null, 2), {'encoding':'utf8'});

let client = MongoClient
	.connect(conf.mongoDB.getURI(), {useNewUrlParser: true})
	.then((client)=>{
		let db = client.db(conf.mongoDB.db);
		let conditions = db.collection('conditions');
		
		conditions.deleteMany({}).then(()=> {
			console.log('Conditions collection cleared');
			conditions.insertMany(conditionsJSON)
				.then((result) => {
					console.log('Insertion complete');
					client.close();
				}).catch((err) => {
				console.log(err);
				client.close();
			});
		});
	}).catch((err)=>{
		console.log(err);
	});