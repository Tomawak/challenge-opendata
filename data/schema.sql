CREATE TYPE vote_type AS ENUM ('SPO','MOC','SPS','SAT');
/* SPO-scrutin public ordinaire
 * MOC-motion de censure
 * SPS-scrutin public solennel
 * SAT-scrutin à la tribune
*/
CREATE TYPE choice_vote AS ENUL('FOR','AGAINST','ABSTAINED','NONVOTING')


CREATE TABLE deputes (
	id SMALLINT PRIMARY KEY, -- export.acteurs.acteur[i].uuid['#text'].substring(2)
	first_name VARCHAR(20), -- export.acteurs.acteur[i].etatCivil.ident.prenom
	last_name VARCHAR(20), -- export.acteurs.acteur[i].etatCivil.ident.nom
	is_male BOOLEAN, -- export.acteurs.acteur[i].etatCivil.ident.civ == "M."
	birthdate DATE, -- to_date(export.acteurs.acteur[i].etatCivil.infoNaissance.dateNais,'YYYY-MM-DD'))
	job_name VARCHAR(20), -- export.acteurs.acteur[i].profession.libelleCourant
	job_category VARCHAR(20), -- export.acteurs.acteur[i].profession.socProcINSEE.catSocPro
	job_family VARCHAR(20), -- export.acteurs.acteur[i].profession.socProcINSEE.famSocPro
);

CREATE TABLE ballots (
	id INTEGER PRIMARY KEY, -- scrutins.scrutin[i].uid
	date_vote DATE, -- to_date(scrutins.scrutin[i].dateScrutin : '2012-07-03','YYYY-MM-DD')
	adopted BOOLEAN, -- scrutins.scrutin[i].sort.code == "adopté"
	name VARCHAR(500), -- scrutins.scrutin[0].titre
	number_voter SMALLINT,
	number_valid_voter SMALLINT,
	number_for SMALLINT,
	number_against SMALLINT,
	number_abstention SMALLINT,
	number_non_voting SMALLINT
);
CREATE TABLE votes (
	id_depute SMALLINT REFERENCES deputes,
	id_ballot INTEGER REFERENCES ballots,
	choice choice_vote
);