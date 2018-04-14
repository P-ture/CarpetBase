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
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [1, 1, 'homepage', 'Homepage', 'I am the homepage.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [2, 2, 'about', 'About', 'I am the about page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [3, 2, 'services', 'Services', 'I am the services page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [4, 2, 'commercial', 'Commercial', 'I am the commercial page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [5, 2, 'projects', 'Projects', 'I am the projects page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [6, 2, 'gallery', 'Gallery', 'I am the gallery page.'], callback);
  db.insert('pages', ['id', 'layout_id', 'slug', 'title', 'content'], [7, 2, 'terms', 'T&Cs', 'I am term page'], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM pages WHERE id IN (1, 2, 3, 4, 5, 6, 7)');
  callback();
};

exports._meta = {
  "version": 1
};
