var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'cX2lcjOkuC',
    password: 'rS58Cs8XrH',
    database: 'cX2lcjOkuC',
    port: '3306'
});



con.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    else {
        console.log('connected as id ' + con.threadId);

    }


});


con.query("INSERT INTO global_shipments (global_id, stage_id) VALUES ('value1', 'value2');",[], function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results)
});

let global_id ="hello";
let stage_id = "there";

con.query("INSERT INTO global_shipments (global_id, stage_id) VALUES (?, ?);", [my_var,my_var2],function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results)
});


con.query('SELECT g.global_id, g.stage_id from global_shipments as g join stage_shipments as s on g.stage_id = s.stage_id WHERE s.active = ?',['Y'], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});


/*


con.query('DELETE FROM global_shipments;', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});







sensor_id = "shipment_sensor";
route_name ="route_name";
channel_key ="key_here";
root ="root_here";
stage_id = "stage_id-2";
timestamp = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; } };

con.query("INSERT INTO stage_shipments (stage_id, route_name, channel_key, root, date, sensor_id) VALUES (?, ?, ?, ?, ?, ?);", [stage_id, route_name, channel_key, root, timestamp , sensor_id],function (error, results, fields) {
    if (error) throw error;
    // connected!
    console.log(results)
});





con.query('SELECT * from stage_shipments;', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});



// DELETE FROM stage_shipments;
// DELETE FROM global_shipments;
// DELETE FROM daily_roots;
// DELETE FROM recent_root;

con.query('DELETE FROM recent_root', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});


*/

con.end();
