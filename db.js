var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'mantae',
    password        : 'tosky12#',
    database        : 'kimskiosk'
});
function getConnection(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        }
    });
}

module.exports = getConnection;

console.log('123')
console.log('123')
console.log('123')
// pool.getConnection(function(err, connection) {
//     if (err) throw err; // not connected!
//
//     // Use the connection
//     connection.query('SELECT title,writer FROM board', function (error, results, fields) {
//         // When done with the connection, release it.
//         connection.release();
//
//         console.log(results)
//         // Handle error after the release.
//         if (error) throw error;
//
//         // Don't use the connection here, it has been returned to the pool.
//     });
//
//
// });