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
  db.insert('layouts', ['id', 'name'], [1, 'Gallery'], callback);
  db.insert('layouts', ['id', 'name'], [2, 'Links'], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM pages WHERE id IN (1, 2)');
  callback();
};

exports._meta = {
  "version": 1
};
