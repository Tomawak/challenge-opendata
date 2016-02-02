var pg = require('pg');
var connectionString = "postgres://postgres:password@localhost/cod";

var votes = [];
var deputes = [];
var ballots = [];

exports.addDepute = function(id,prenom,nom,isMale,dateNais,profession,catSocPro,famSocPro) {
	deputes.push([id,
		prenom,
		nom,
		isMale,
		dateNais,
		profession,
		catSocPro,
		famSocPro]);
}

exports.addVote = function(idDepute,idBallot,vote) {
	votes.push([
		idDepute,
		idBallot,
		vote
	]);
}

exports.addBallot = function(id,date,isAdopted,name){
	ballots.push([
		id,
		date,
		isAdopted,
		name
	]);
}

function saveInDB(requestString,values) {
	var valuesAdded = 0;
	pg.connect(connectionString, function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		values.forEach(function(value){
			client.query(requestString,value, function(err, result) {
				//call `done()` to release the client back to the pool
				done();
				if(err) {
					return console.error('error running query', err);
				}
				valuesAdded=valuesAdded+1;
				if(values.length===valuesAdded) {
					client.end();
				}
			});
		});
	});
};

exports.saveDeputes = function() {
	saveInDB("INSERT INTO deputes VALUES ($1,$2,$3,$4,to_date($5,'YYYY-MM-DD'),$6,$7,$8)",deputes);
};

exports.saveVotes = function() {
	saveInDB("INSERT INTO votes VALUES ($1,$2,$3)",votes);
}

exports.saveBallots = function() {
	saveInDB("INSERT INTO ballots VALUES ($1,to_date($2,'YYYY-MM-DD'),$3,$4)",ballots);
}