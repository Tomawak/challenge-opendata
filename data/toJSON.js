var pg = require('pg');
var fs = require('fs');
var connectionConfig = {
	user: 'postgres',
	password: 'password',
	database: 'cod',
	host: '129.88.57.54',
	port: 8001
};
//ajouter correctement

var position = {};
var deputes = [];
var links = [];
var compt = 0;
var finalResult = {};
var links_done  = false;
var deputes_done = false;

function writeFile() {
	finalResult = {
		"depute":deputes,
		"links":links
	};
	console.log(JSON.stringify(finalResult))
}

pg.connect(connectionConfig, function(err, client, done) {
	if(err) {
		return console.error('error fetching client from pool', err);
	}
	//ajouter parti
	client.query("SELECT d.id,d.first_name,d.last_name FROM deputes d ORDER BY d.id ;", function(err, result) {
		if(err) {
			return console.error('error running query', err);
		}
		result.rows.forEach(function(row){
			deputes.push({
				"name":row.first_name +" "+row.last_name,
				"parti": 1//A MODIFIER
			});
			position[row.id]=compt;
			compt++;

		});
		deputes_done = true;
		if(links_done) {
			writeFile();
			client.end();
		}
	});

	client.query("SELECT * FROM similarity", function(err, result) {
		if(err) {
			return console.error('error running query', err);
		}
		result.rows.forEach(function(row){
			links.push({
				"source":position[row.id_depute_a],
				"target":position[row.id_depute_b],
				"value":row.similarity
			});
		});
		links_done = true;
		if(deputes_done) {
			writeFile();
			client.end();
		}
	});
});
