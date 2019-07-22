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


// DELETE FROM stage_shipments;
// DELETE FROM global_shipments;
// DELETE FROM daily_roots;
// DELETE FROM recent_root;
// DELETE FROM global_items;

con.query('DELETE FROM recent_root', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});


con.query('DELETE FROM stage_shipments', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});


con.query('DELETE FROM global_shipments', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});
con.query('DELETE FROM daily_roots', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});
con.query('DELETE FROM global_items', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
});