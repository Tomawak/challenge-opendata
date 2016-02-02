CREATE TYPE vote_type AS ENUM ('SPO','MOC','SPS','SAT');
/* SPO-scrutin public ordinaire
 * MOC-motion de censure
 * SPS-scrutin public solennel
 * SAT-scrutin à la tribune
*/
CREATE TYPE choice_vote AS ENUM('FOR','AGAINST','ABSTAINED','NONVOTING');

DROP TABLE deputes CASCADE;
DROP TABLE ballots CASCADE;
DROP TABLE similarity;
DROP TABLE votes;


CREATE TABLE deputes (
	id INTEGER PRIMARY KEY, -- export.acteurs.acteur[i].uuid['#text'].substring(2)
	first_name VARCHAR(20), -- export.acteurs.acteur[i].etatCivil.ident.prenom
	last_name VARCHAR(20), -- export.acteurs.acteur[i].etatCivil.ident.nom
	is_male BOOLEAN, -- export.acteurs.acteur[i].etatCivil.ident.civ == "M."
	birthdate DATE, -- to_date(export.acteurs.acteur[i].etatCivil.infoNaissance.dateNais,'YYYY-MM-DD'))
	job_name VARCHAR(80), -- export.acteurs.acteur[i].profession.libelleCourant
	job_category VARCHAR(50), -- export.acteurs.acteur[i].profession.socProcINSEE.catSocPro
	job_family VARCHAR(25) -- export.acteurs.acteur[i].profession.socProcINSEE.famSocPro
);

CREATE TABLE ballots (
	id INTEGER PRIMARY KEY, -- scrutins.scrutin[i].numero
	date_vote DATE, -- to_date(scrutins.scrutin[i].dateScrutin : '2012-07-03','YYYY-MM-DD')
	adopted BOOLEAN, -- scrutins.scrutin[i].sort.code == "adopté"
	name VARCHAR(500) -- scrutins.scrutin[0].titre
);

CREATE TABLE votes (
	id_depute INTEGER REFERENCES deputes,
	id_ballot INTEGER REFERENCES ballots,
	choice choice_vote,
	PRIMARY KEY(id_depute,id_ballot)
);

CREATE TABLE similarity (
	id_depute_a INTEGER REFERENCES deputes,
	id_depute_b INTEGER REFERENCES deputes,
	similarity SMALLINT,
	PRIMARY KEY(id_depute_a,id_depute_b)
);