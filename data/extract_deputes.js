var fs = require('fs');
var util = require('util');
var sqlaccess = require('./sqlaccess');

var dataDeputes = JSON.parse(fs.readFileSync('data_files/AMO10_deputes_actifs_mandats_actifs_organes_XIV.json', 'utf8'));

dataDeputes.export.acteurs.acteur.forEach(function(depute,i,deputes){
	sqlaccess.addDepute(
		depute.uid['#text'].substring(2),
		depute.etatCivil.ident.prenom,
		depute.etatCivil.ident.nom,
		depute.etatCivil.ident.civ === "M.",
		depute.etatCivil.infoNaissance.dateNais,
		depute.profession.libelleCourant,
		depute.profession.socProcINSEE.catSocPro,
		depute.profession.socProcINSEE.famSocPro
	);
	if(i === deputes.length-1) {
		sqlaccess.saveDeputes();
	}
})