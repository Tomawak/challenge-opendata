var pg = require('pg');
var fs = require('fs');
var connectionString = "postgres://postgres:password@localhost/cod";
//ajouter correctement

var position = {};
var deputes = [];
var links = [];
var compt =0;
var finalResult ={};

function getDeputes() {
    pg.connect(connectionString, function(err, client, done) {
	if(err) {
	    return console.error('error fetching client from pool', err);
	}
        //ajouter parti
	client.query("SELECT d.id,d.first_name,d.last_name FROM deputes d ORDER BY d.id ;", function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();
	    if(err) {
		return console.error('error running query', err);
	    }
            //console.log(result.rows);
            result.rows.forEach(function(row){
                deputes.push({
                    "name":row.first_name +" "+row.last_name,
                    "parti": 1//A MODIFIER
                });
                position[row.id]=compt;
                compt++;
                
            });
            client.end();
            getSimilarite();
            
            
	});
    });
}

function getSimilarite() {
    pg.connect(connectionString, function(err, client, done) {
	if(err) {
	    return console.error('error fetching client from pool', err);
	}
        //ajouter parti
	client.query("SELECT s.id_depute_a, s.id_depute_b, s.similarite  FROM Similarite s;", function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();
	    if(err) {
		return console.error('error running query', err);
	    }
            result.rows.forEach(function(row){
                links.push({
                    "source":position[row.id_depute_a],
                    "target":position[row.id_depute_b],
                    "value":row.similarite
                });
            });
            finalResult = {
                "depute":deputes,
                "links":links
            };
            fs.writeFile('depute.json', JSON.stringify(finalResult), function (err) {
                if (err) return console.log(err);
            });
            client.end();
	});
    });
}



getDeputes();

