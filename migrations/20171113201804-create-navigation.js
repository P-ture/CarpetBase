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
  db.insert('navigation', ['id', 'name', 'href', 'order'], [1, 'Home', '/', 1], callback);
  db.insert('navigation', ['id', 'name', 'href', 'order'], [2, 'About', '/about.html', 2], callback);
  db.insert('navigation', ['id', 'name', 'href', 'order'], [3, 'Services', '/services.html', 3], callback);
  db.insert('navigation', ['id', 'name', 'href', 'order'], [4, 'Commercial', '/commercial.html', 4], callback);
  db.insert('navigation', ['id', 'name', 'href', 'order'], [5, 'Projects', '/projects.html', 5], callback);
  db.insert('navigation', ['id', 'name', 'href', 'order'], [6, 'Gallery', '/gallery.html', 6], callback);
  db.insert('navigation', ['id', 'name', 'href', 'order'], [7, 'Contact', '/contact.html', 7], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM navigation WHERE id IN (1, 2, 3, 4, 5, 6)');
  callback();
};

exports._meta = {
  "version": 1
};
