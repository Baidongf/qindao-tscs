// const logger = require('../../logger').logger
// var orm = require("orm");

// const ormAll = orm.express("mysql://bigdata:bigdata@172.16.215.10:3306/bigdata_monitor_dev", {
// 	define: function (db, models, next) {
//         console.log(db)
// 		models.groupLise = db.define("offline_group_list", {
//             group_name: String,
//             paths: String
//         });
// 		next();
// 	}
// })

// module.exports = ormAll
var orm = require('orm');

orm.connect("mysql://whale_home:whale_home@2017@192.168.1.44:3306/whale_home", function(err, db){
    console.log(err)
    // if (err) throw err;÷
	// var Person = db.define("offline_group_list", {
    //     group_name: String,
    //     paths: String
    // });
})