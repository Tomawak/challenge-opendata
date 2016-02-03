var pg = require('pg');
var fs = require('fs');
var connectionConfig = {
	user: 'postgres',
	password: 'password',
	database: 'cod',
	host: '129.88.57.73',
	port: 8001
};
//ajouter correctement

var position = {};
var deputes = [];
var links = [];
var groups = [];
var compt =0;
var finalResult ={};

function initLinks() {

    for (i =0 ; i<7;i++) {
        links[i]=-1;
    }
    for (i =0 ; i<7;i++) {
        for (j =0 ; j<7;j++) {
            links[i][j]=-1;
        }
    }
}

function getDeputes() {
    pg.connect(connectionConfig, function(err, client, done) {
	if(err) {
	    return console.error('error fetching client from pool', err);
	}
        //ajouter parti
	client.query("SELECT d.id,d.first_name,d.last_name,d.group, g.name FROM deputes d, groups g where g.id=d.group ORDER BY d.group ;", function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();
	    if(err) {
		return console.error('error running query', err);
	    }
            //console.log(result.rows);
            var lastGroupPos = -1;
            var lastGroupID = -1;
            result.rows.forEach(function(row){
                deputes.push({
                    "name":row.first_name +" "+row.last_name,
                    "group": row.group
                });
                //mise a jour du groupe
                if(row.group!=lastGroupID){
                    if (lastGroupPos==-1){
                        groups.push({
                            "begin": compt
                            "end": compt+1
                            "name": row.name
                        });
                    } else {
                        groups.push({
                            "begin": compt
                            "end": compt+1
                            "name": row.name
                        });
                        groups[lastGroupPos].end=compt-1;
                    }
                    lastGroupID=row.group;
                    lastGroupPos++;
                }
                position[row.id]=compt;
                compt++;
                
            });
            groups[lastGroupPos].end=deputes.length;
            

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
	client.query("SELECT s.id_depute_a, d1.group AS groupA s.id_depute_b,d2.group AS groupB, s.similarity  FROM Similarity s, Depute d1, Depute d2 where s.id_depute_a = d1.id and s.id_depute_b = d2.id;", function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();
	    if(err) {
		return console.error('error running query', err);
	    }
            initLinks();
            result.rows.forEach(function(row){
                links[row.groupA][row.groupB]={
                    "source":position[row.id_depute_a],
                    "target":position[row.id_depute_b],
                    "value":row.similarity
                };
            });
            finalResult = {
                "depute":deputes,
                "links":links,
                "groups":groups
            };
            fs.writeFile('public/similarity.json', JSON.stringify(finalResult), function (err) {
                if (err) return console.log(err);
            });
            client.end();
	});
    });
}



getDeputes();