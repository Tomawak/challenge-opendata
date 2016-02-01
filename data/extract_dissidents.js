Object.prototype.forEach = function(callback){
	callback(this);
}

var fs = require('fs');
var util = require('util');
var dataVotes = JSON.parse(fs.readFileSync('data_files/Scrutins_XIV.json', 'utf8'));
var dataDeputes = JSON.parse(fs.readFileSync('data_files/AMO10_deputes_actifs_mandats_actifs_organes_XIV.json', 'utf8'));

var groupes_parlementaires = dataDeputes.export.organes.organe
	.filter(function(x){
		return x.codeType=="GP"
	}).map(function(x){
		var ret = {};
		ret[x.uid]=x;
		return ret;
	});

var nested_organes_deputes = dataDeputes.export.acteurs.acteur.map(function(x){
	return x.mandats.mandat.filter(function(mandat){return mandat.typeOrgane=="GP"})
	.map(function(mandat){
		return {acteur : mandat.acteurRef,organe : mandat.organes.organeRef }
	})
})

var organes_deputes = [].concat.apply([],nested_organes_deputes)
var map_organe ={};
organes_deputes.forEach(function(x){
	if(map_organe[x.organe]) {
		map_organe[x.organe].push(x.acteur)
	} else {
		map_organe[x.organe] = [x.acteur]
	}
})

function treatNominatif(list,vote_id,vote) {
	if(list) {
		list.votant.forEach(function(x){
			console.log(x.acteurRef+":"+vote_id+":"+vote)
		})
	}
}
function treatPositionGroupe(groupeID,vote_id,vote,dissidents) {

	var vote_db_name;
	switch(vote) {
		case "pour":
			vote_db_name = "FOR";
			break;
		case "contre":
			vote_db_name = "AGAINST";
			break;
		case "abstention":
			vote_db_name = "ABSTAINED";
			break;
		default:
			vote_db_name = "ABSTAINED";
	}
	if(map_organe[groupeID]) {
		map_organe[groupeID].filter(function(x){
			return dissidents.indexOf(x) == -1
		}).forEach(function(depute){
			console.log(depute+":"+vote_id+":"+vote_db_name)
		})
	}
}

function addDissidents(dissidents,group) {
	if(group) {
		if(util.isArray(group.votant)) {
			dissidents = dissidents.concat(group.votant)
		}
		else {
			dissidents.push(group.votant)
		}
	}
}

dataVotes.scrutins.scrutin.filter(function(x){
	return x.modePublicationDesVotes=='DecompteDissidentsPositionGroupe'
}).forEach(function(vote) {
	vote.ventilationVotes.organe.groupes.groupe.forEach(function(groupe){


		var dissidents = [];
		addDissidents(dissidents,groupe.vote.decompteNominatif.nonVotants);
		addDissidents(dissidents,groupe.vote.decompteNominatif.pours);
		addDissidents(dissidents,groupe.vote.decompteNominatif.contres);
		addDissidents(dissidents,groupe.vote.decompteNominatif.abstentions);



		treatPositionGroupe(groupe.organeRef,vote.uid,groupe.vote.positionMajoritaire,dissidents)

		treatNominatif(groupe.vote.decompteNominatif.nonVotants,vote.uid,"NONVOTING")
		treatNominatif(groupe.vote.decompteNominatif.pours,vote.uid,"FOR")
		treatNominatif(groupe.vote.decompteNominatif.contres,vote.uid,"AGAINST")
		treatNominatif(groupe.vote.decompteNominatif.abstentions,vote.uid,"ABSTAINED")
	})
})