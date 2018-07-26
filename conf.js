function getMongooseURI(data)
{
	let user = data.user?encodeURIComponent(data.user):'',
		pwd = data.pwd?':'+encodeURIComponent(data.pwd):'',
		host = data.host?data.host:'localhost',
		port = data.port?data.port:'27017',
		db = data.db?data.db:''
	
	return `mongodb://${user}${pwd}@${host}:${port}/${db}`;
}


module.exports = {
	clientToken:'NDcxNzExMzE2MDIxODcwNjA1.DjozIA.ELPEwsbgpsPbsjNwWx6IQVb-vCA',
	mongoDB:{
		'user':'conditions_dba',
		'pwd':'conditions_password_9801#Frances#OPERAND',
		'db':'wing_conditions',
		getURI:()=>{return getMongooseURI(this);}
	}
}