'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.insert('navigation', ['page_id', 'name', 'order'], [1, 'Homepage', 1], callback);
  db.insert('navigation', ['page_id', 'name', 'order'], [2, 'About', 2], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM navigation WHERE page_id = 1 LIMIT 1');
  db.runSql('DELETE FROM navigation WHERE page_id = 2 LIMIT 1');
  callback();
};

exports._meta = {
  "version": 1
};
