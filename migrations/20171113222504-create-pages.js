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
  db.insert('pages', ['layout_id', 'slug', 'title', 'content'], [1, null, 'Welcome', 'Welcome to CarpetBase!'], callback);
  db.insert('pages', ['layout_id', 'slug', 'title', 'content'], [2, 'about', 'About Us', 'All about CarpetBase.'], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM pages WHERE ISNULL(slug) LIMIT 1');
  db.runSql('DELETE FROM pages WHERE slug = "about" LIMIT 1');
  callback();
};

exports._meta = {
  "version": 1
};
