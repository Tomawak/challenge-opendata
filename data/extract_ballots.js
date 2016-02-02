var fs = require('fs');
var util = require('util');
var sqlaccess = require('./sqlaccess');

var dataBallots = JSON.parse(fs.readFileSync('data_files/Scrutins_XIV.json', 'utf8'));

dataBallots.scrutins.scrutin.forEach(function(ballot,i,ballots) {
	sqlaccess.addBallot(
		ballot.numero,
		ballot.dateScrutin,
		ballot.sort.code === "adopté",
		ballot.titre
	);
	if(i === ballots.length-1) {
		sqlaccess.saveBallots();
	}
});