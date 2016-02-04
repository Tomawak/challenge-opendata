if(!process.env.POSTGRES_IP) {
	console.error("Please set the environment variable POSTGRES_IP")
	process.exit()
}
if(!process.env.POSTGRES_USER) {
	console.error("Please set the environment variable POSTGRES_USER")
	process.exit()
}
if(!process.env.POSTGRES_PASSWORD) {
	console.error("Please set the environment variable POSTGRES_PASSWORD")
	process.exit()
}
if(!process.env.POSTGRES_IP) {
	console.error("Please set the environment variable POSTGRES_IP")
	process.exit()
}

var fs = require('fs');
var pg = require('pg');
var connectionConfig = {
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: 'cod',
	host: process.env.POSTGRES_IP,
	port: 8001
};

var position = {};
var deputes = [];
var links = [];
var groups = [];

for (var i =0 ; i<7;i++) {
	links[i]=[];
	for (var j =0 ; j<7;j++) {
		links[i][j]=[];
	}
}

var numberRequestDone = 0;

function aRequestIsDone (client) {
	numberRequestDone=numberRequestDone+1;
	if(numberRequestDone===2) {
		allRequestAreDone(client);
	}
}

function allRequestAreDone(client) {
	client.end();
	var finalResult = {
		"depute":deputes,
		"links":links,
		"groups":groups
	};
	console.log(JSON.stringify(finalResult));
}


pg.connect(connectionConfig, function(err, client, done) {
	if(err) {
		return console.error('error fetching client from pool', err);
	}

	client.query("SELECT deputes.id,"
							+"deputes.first_name,"
							+"deputes.last_name,"
							+"deputes.group_id,"
							+"groups.name,"
							+"deputes.is_male,"
							+"deputes.birthdate,"
							+"deputes.job_family "
					+"FROM deputes, groups "
					+"WHERE groups.id=deputes.group_id "
					+"ORDER BY deputes.group_id"
	, function(err, result) {
		if(err) {
			return console.error('error running query', err);
		}
		var currentGroup = 0;
		var firstGroupName = null;
		var lastGroup = null;
		var lastGroupName = null;
		var lastGroupId;

		result.rows.forEach(function(row,index){
			deputes.push({
				"name":row.first_name +" "+row.last_name,
				"group": row.group_id,
				"id" : row.id,
				"is_male" : row.is_male,
				"birthdate" : row.birthdate,
				"job" : row.job_family

			});

			if(!firstGroupName) { firstGroupName = row.name }
			//mise a jour du groupe
			if(row.group_id!=currentGroup){
				var newGroup = {
					"begin": lastGroup?lastGroup.end+1:0,
					"end": index-1,
					"name": lastGroupName?lastGroupName:firstGroupName
				};
				groups[currentGroup] = newGroup;
				lastGroup=newGroup;
				lastGroupName=row.name;
				currentGroup=row.group_id;
			}
			position[row.id]=index;
		})

		groups[currentGroup] = {
			"begin": lastGroup.end+1,
			"end": 575,
			"name": lastGroupName
		}

		aRequestIsDone(client);
	});

	client.query("SELECT sim.id_depute_a,"
		+"deputesA.group_id AS group_a,"
		+"sim.id_depute_b,"
		+"deputesB.group_id AS group_b,"
		+"sim.similarity "
		+"FROM similarity AS sim, deputes AS deputesA, deputes AS deputesB "
		+"WHERE sim.id_depute_a=deputesA.id "
		+"AND sim.id_depute_b=deputesB.id "
		+"ORDER BY sim.id_depute_a",
		function(err, result) {
			if(err) {
				return console.error('error running query', err);
			}
			result.rows.forEach(function(row){
				var link = {
					"source":position[row.id_depute_a],
					"target":position[row.id_depute_b],
					"value":row.similarity
				}
				links[row.group_a][row.group_b].push(link);
				links[row.group_b][row.group_a].push(link);
			});
			aRequestIsDone(client);
	});
});
