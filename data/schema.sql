CREATE TYPE vote_type AS ENUM ('SPO','MOC','SPS','SAT');
/* SPO-scrutin public ordinaire
 * MOC-motion de censure
 * SPS-scrutin public solennel
 * SAT-scrutin à la tribune
*/
CREATE TYPE choice_vote AS ENUM('FOR','AGAINST','ABSTAINED');

DROP TABLE groups;
DROP TABLE deputes CASCADE;
DROP TABLE ballots CASCADE;
DROP TABLE similarity;
DROP TABLE votes;

CREATE TABLE groups (
	id SMALLINT PRIMARY KEY,
	name VARCHAR(50)
);

INSERT INTO groups (id,name) VALUES
(0,'Gauche démocrate et républicaine'),
(1,'Socialiste, républicain et citoyen'),
(2,'Écologiste'),
(3,'Radical, républicain, démocrate et progressiste'),
(4,'Union des démocrates et indépendants'),
(5,'Les Républicains'),
(6,'Non inscrit');

CREATE TABLE deputes (
	id INTEGER PRIMARY KEY, -- export.acteurs.acteur[i].uuid['#text'].substring(2)
	first_name VARCHAR(20), -- export.acteurs.acteur[i].etatCivil.ident.prenom
	last_name VARCHAR(20), -- export.acteurs.acteur[i].etatCivil.ident.nom
	is_male BOOLEAN, -- export.acteurs.acteur[i].etatCivil.ident.civ == "M."
	birthdate DATE, -- to_date(export.acteurs.acteur[i].etatCivil.infoNaissance.dateNais,'YYYY-MM-DD'))
	job_name VARCHAR(80), -- export.acteurs.acteur[i].profession.libelleCourant
	job_category VARCHAR(50), -- export.acteurs.acteur[i].profession.socProcINSEE.catSocPro
	job_family VARCHAR(25), -- export.acteurs.acteur[i].profession.socProcINSEE.famSocPro
	group_id SMALLINT REFERENCES groups
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
	is_nominative BOOLEAN,
	PRIMARY KEY(id_depute,id_ballot)
);

CREATE TABLE similarity (
	id_depute_a INTEGER REFERENCES deputes,
	id_depute_b INTEGER REFERENCES deputes,
	similarity SMALLINT,
	PRIMARY KEY(id_depute_a,id_depute_b)
);
