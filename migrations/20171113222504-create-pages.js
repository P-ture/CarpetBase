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
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [1, 1, null, 'Homepage', 'I am the homepage.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [2, 1, 'about', 'About', 'I am the about page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [3, 1, 'services', 'Services', 'I am the services page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [4, 1, 'commercial', 'Commercial', 'I am the commercial page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [5, 1, 'projects', 'Projects', 'I am the projects page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [6, 1, 'gallery', 'Gallery', 'I am the gallery page.'], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM pages WHERE id IN (1, 2, 3, 4, 5, 6)');
  callback();
};

exports._meta = {
  "version": 1
};
