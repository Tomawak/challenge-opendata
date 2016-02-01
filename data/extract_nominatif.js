	Array.prototype.unique = function() {var unique = [];for (var i = 0; i < this.length; i++) {if (unique.indexOf(this[i]) == -1) {unique.push(this[i]);}}return unique;};
	//chargement d'un fichier json
	var fs = require('fs');
	var data = JSON.parse(fs.readFileSync('data_files/Scrutins_XIV.json','utf8'));
	var util = require('util');
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
			voteExtraction(x,"NONVOTANT",numero_scrutin);
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
			voteExtraction(x,"ABSTENTION",numero_scrutin);
		});
	}
//elt.vote.decompteNominatif.contres.foreach(vote_extraction(,"AGAINST"))
//elt.vote.decompteNominatif.abstentions.foreach(vote_extraction(,"ABSTENTION"))
}

function voteExtraction(elt,vote,numero_scrutin) {
	if (elt.acteurRef) {
		var tab = actors.filter(function (x) {
			return (x.actor===elt.acteurRef)				
		});
		// si l'acteur n'est pas repété, on l'insère
		if (tab.length==0) {
			console.log("Depute= "+elt.acteurRef+ " ,Scrutin="+ numero_scrutin +", vote= "+vote); 
			actors.push({"actor" : elt.acteurRef,"vote":vote});
			counter = counter+1;
		}
	}
}

function scrutinDecomp(elt_scrutin) {
	actors = [];
	if(elt_scrutin.modePublicationDesVotes == "DecompteNominatif") {
		elt_scrutin.ventilationVotes.organe.groupes.groupe.forEach(function (x) {qgroupeDecomp(x,elt_scrutin.numero);});
		//votes = votes +1;
	}
}
data.scrutins.scrutin.forEach(scrutinDecomp);

	
/*data.scrutins.scrutin
.filter(function(x) {
	return x.modePublicationDesVotes == "DecompteNominatif"
})
.forEach(function(scrutin) {
	scrutin.ventilationVotes.organe.groupes.groupe.forEach(function (x) {
		groupeDecomp(x,scrutin.numero)
	});
});*/


//data.scrutins.scrutin[1160].ventilationVotes.organe.groupes.groupe.forEach(function (x) {groupeDecomp(x,1156)});

//console.log(counter);
