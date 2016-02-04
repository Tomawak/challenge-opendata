if(!process.env.POSTGRES_IP) {
	console.error("Please set the environment variable POSTGRES_IP")
	process.exit()
}

var pg = require('pg');
var fs = require('fs');
var connectionConfig = {
	user: 'postgres',
	password: 'password',
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

	client.query("SELECT    deputes.id,"
							+"deputes.first_name,"
							+"deputes.last_name,"
							+"deputes.group_id,"
							+"groups.name "
					+"FROM deputes, groups "
					+"WHERE groups.id=deputes.group_id "
					+"ORDER BY deputes.group_id ;"
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
				"id" : row.id
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

		client.query("SELECT    sim.id_depute_a,"
			+"deputesA.group_id AS groupA,"
			+"sim.id_depute_b,"
			+"deputesB.group_id AS groupB,"
			+"sim.similarity "
			+"FROM similarity AS sim, deputes AS deputesA, deputes AS deputesB "
			+"WHERE sim.id_depute_a=deputesA.id "
			+"AND sim.id_depute_b=deputesB.id",
			function(err, result) {
				if(err) {
					return console.error('error running query', err);
				}
				result.rows.forEach(function(row){
					links[row.groupa][row.groupb].push({
						"source":position[row.id_depute_a],
						"target":position[row.id_depute_b],
						"value":row.similarity
					});
				});
				allRequestAreDone(client);
		});
	});
});
