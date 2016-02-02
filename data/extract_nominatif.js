	Array.prototype.unique = function() {var unique = [];for (var i = 0; i < this.length; i++) {if (unique.indexOf(this[i]) == -1) {unique.push(this[i]);}}return unique;};
	//chargement d'un fichier json
	var fs = require('fs');
	var data = JSON.parse(fs.readFileSync('data_files/Scrutins_XIV.json','utf8'));
	var util = require('util');
	var sqlaccess = require('./sqlaccess_test.js');
	var counter = 0;
	var votes =0;
	var actors = [];
Object.prototype.forEach = function(callback) {
	callback(this)
}

function groupeDecomp(elt,numero_scrutin) {
// pour chaque groupe
	if(elt.vote.decompteNominatif.nonVotants) {
		elt.vote.decompteNominatif.nonVotants.votant.forEach(function (x) {
			voteExtraction(x,"NONVOTING",numero_scrutin);
		});
	}
	if(elt.vote.decompteNominatif.pours) {
		elt.vote.decompteNominatif.pours.votant.forEach(function (x) {
			voteExtraction(x,"FOR",numero_scrutin);
		});
	} 
	if(elt.vote.decompteNominatif.contres) {
		elt.vote.decompteNominatif.contres.votant.forEach(function (x) {
			voteExtraction(x,"AGAINST",numero_scrutin);
		});
	} 
	if(elt.vote.decompteNominatif.abstentions) {
		elt.vote.decompteNominatif.abstentions.votant.forEach(function (x) {
			voteExtraction(x,"ABSTAINED",numero_scrutin);
		});
	}
}

function voteExtraction(elt,vote,numero_scrutin) {
	if (elt.acteurRef) {
		var tab = actors.filter(function (x) {
			return (x.actor===elt.acteurRef)				
		});
		// si l'acteur n'est pas repété, on l'insère
		if (tab.length==0) {
			var cuted_acteur_ref = elt.acteurRef.substring(2);
			sqlaccess.addVote(cuted_acteur_ref,numero_scrutin,vote,true);
			actors.push({"actor" : elt.acteurRef,"vote":vote});
			counter = counter+1;
		}
	}
}

function scrutinDecomp(elt_scrutin) {
	actors = [];
	if(elt_scrutin.modePublicationDesVotes == "DecompteNominatif") {
		elt_scrutin.ventilationVotes.organe.groupes.groupe.forEach(function (x) {groupeDecomp(x,elt_scrutin.numero);});
	}
}
data.scrutins.scrutin.forEach(scrutinDecomp);
sqlaccess.saveVotes();


