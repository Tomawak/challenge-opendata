var pg = require('pg');
var fs = require('fs');
var connectionConfig = {
	user: 'postgres',
	password: 'password',
	database: 'cod',
	host: '129.88.57.46',
	port: 8001
};
//ajouter correctement

var position = {};
var deputes = [];
var links = [];
var compt =0;
var finalResult ={};

function getDeputes() {
    pg.connect(connectionConfig, function(err, client, done) {
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
            //console.log(position);
            getSimilarity();
            
            
	});
    });
}

function getSimilarity() {
    pg.connect(connectionConfig, function(err, client, done) {
	if(err) {
	    return console.error('error fetching client from pool', err);
	}
        //ajouter parti
	client.query("SELECT s.id_depute_a, s.id_depute_b, s.similarity  FROM Similarity s;", function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();
	    if(err) {
		return console.error('error running query', err);
	    }
            result.rows.forEach(function(row){
                links.push({
                    "source":position[row.id_depute_a],
                    "target":position[row.id_depute_b],
                    "value":row.similarity
                });
            });
            finalResult = {
                "depute":deputes,
                "links":links
            };
            fs.writeFile('public/similarity.json', JSON.stringify(finalResult), function (err) {
                if (err) return console.log(err);
            });
            client.end();
	});
    });
}



getDeputes();

