Recommandation pour l'exploration
=================================

Ouvrez `node` (https://nodejs.org/en/download/package-manager/) puis :

```javascript
	//permet de réduire un array a ses valeurs uniques
	Array.prototype.unique = function() {
		var unique = [];
		for (var i = 0; i < this.length; i++) {
			if (unique.indexOf(this[i]) == -1) {
				unique.push(this[i]);
			}
		}
		return unique;
	};
	//chargement d'un fichier json
	var fs = require('fs');
	var data = JSON.parse(fs.readFileSync('data_files/Scrutins_XIV.json', 'utf8'));
	//exploration du fichier
	data.scrutins.scrutin[0]
	data.scrutins.scrutin[0].typeVote.typeMajorite
	data.scrutins.scrutin.map(function(x){return x.legislature}).unique()
	data.scrutins.scrutin.map(function(x){return Object.keys(x.syntheseVote).join()}).unique()
```

Résultat de l'exploration
=========================

Table 'deputes' : depuis AMO10_deputes_actifs_mandats_actifs_organes_XIV.json
-----------------------------------------------------------------------------

```
export.acteurs.acteur[0].uuid.#text : PM702804 (ID)
export.acteurs.acteur[0].etatCivil.ident.civ : 'M.'
export.acteurs.acteur[0].etatCivil.ident.prenom : 'Stéphane'
export.acteurs.acteur[0].etatCivil.ident.nom : 'Claireaux'
export.acteurs.acteur[0].etatCivil.infoNaissance.dateNais : '1964-06-23'
export.acteurs.acteur[0].profession.libelleCourant : 'Chef d\'entreprise'
export.acteurs.acteur[0].profession.socProcINSEE.catSocPro : 'Cadres supérieurs (secteur privé)'
export.acteurs.acteur[0].profession.socProcINSEE.famSocPro : 'Cadres et ingénieurs'
export.acteurs.acteur[0].mandats.mandat[0].mandature.datePriseFonction : '2014-07-30'
```

Table 'votes' : depuis Scrutins_XIV.json
----------------------------------------

```
scrutins.scrutin[0].uid : 'VTANR5L14V1'
scrutins.scrutin[0].dateScrutin : '2012-07-03'
scrutins.scrutin[0].typeVote.codeTypeVote : 'SAT'
```

Différentes valeurs de codeTypeVote :

* SPO-scrutin public ordinaire
* MOC-motion de censure
* SPS-scrutin public solennel
* SAT-scrutin à la tribune

```
scrutins.scrutin[0].sort.code : 'adopté'
scrutins.scrutin[0].titre : *description de la loi*
scrutins.scrutin[0].modePublicationDesVotes : 'DecompteNominatif'
```

Différentes valeurs de modePublicationDesVotes :

* DecompteDissidentsPositionGroupe
* DecompteNominatif


Synthese des votes (communes aux 2 modePublicationDesVotes) :
```
scrutins.scrutin[0].syntheseVote.nombreVotants: '561'
scrutins.scrutin[0].syntheseVote.suffragesExprimes: '542'
scrutins.scrutin[0].syntheseVote.annonce: 'l\'Assemblée nationale a adopté',
scrutins.scrutin[0].syntheseVote.decompte.nonVotant : '16'
scrutins.scrutin[0].syntheseVote.decomptepour : '296'
scrutins.scrutin[0].syntheseVote.decomptecontre : '246'
scrutins.scrutin[0].syntheseVote.decompteabstention: '19'
```