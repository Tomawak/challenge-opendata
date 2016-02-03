var fs = require('fs');
var sqlaccess = require('./sqlaccess');
var dataDeputes = JSON.parse(fs.readFileSync('data_files/AMO10_deputes_actifs_mandats_actifs_organes_XIV.json','utf8'));
Array.prototype.unique = function() {var unique = [];for (var i = 0; i < this.length; i++) {if (unique.indexOf(this[i]) == -1) {unique.push(this[i]);}}return unique;};


var deputesAndGroupe = {}
var values = [];
dataDeputes.export.acteurs.acteur
.forEach(function(dep){
	var group =	dep.mandats.mandat
		.filter(function(x) {
			return x.typeOrgane == "GP"
		})[0].organes.organeRef;
	deputesAndGroupe[dep.uid['#text'].substring(2)] = group
})
console.log("tab done")
for(deputeId in deputesAndGroupe) {
	console.log("treating deputeId :"+deputeId)
	var groupName = dataDeputes.export.organes.organe
	.filter(function(organe){
		return organe.uid==deputesAndGroupe[deputeId]
	})[0].libelle;
	groupName = groupName==="Union pour un Mouvement Populaire"?"Les Républicains":groupName;
	values.push([groupName,deputeId])
}
var subquery = "SELECT id FROM groups WHERE name=$1";
var requestString = "UPDATE deputes	SET group_id=subquery.id FROM ("+subquery+") AS subquery WHERE deputes.id=$2"
sqlaccess.saveInDB(requestString,values)
// .map(function(groupID){
//
// 	return {
// 		id : groupID,
// 		name : groupName
// 	}
// });

// console.log("List of groups in AN :")
// console.log(groupes)
// dataDeputes.export.acteurs.acteur
// .map(function(dep){
// 	return {
// 		dep : dep.uid['#text'],
// 		parti : dep.mandats.mandat.filter(function(x) {
// 					return x.typeOrgane == "GP"
// 				})[0].organes.organeRef
// 	}
// })