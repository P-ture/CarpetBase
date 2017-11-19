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
  db.insert('meta', ['id', 'key', 'value'], [1, 'slogan', 'Carpet & Flooring Retailers & Contractors'], callback);
  db.insert('meta', ['id', 'key', 'value'], [2, 'social', `
* [Facebook](#)
* [Twitter](#)
* [LinkedIn](#)
  `.trim()], callback);
  db.insert('meta', ['id', 'key', 'value'], [3, 'latitude', '51.4492704'], callback);
  db.insert('meta', ['id', 'key', 'value'], [4, 'longitude', '-0.1462397'], callback);
  db.insert('meta', ['id', 'key', 'value'], [5, 'address', '190 Cavendish Rd, London, SW12 0BZ'], callback);
  db.insert('meta', ['id', 'key', 'value'], [6, 'telephone', '020 8675 2232'], callback);
  db.insert('meta', ['id', 'key', 'value'], [7, 'email', 'info@carpetbase.com'], callback);
};

exports.down = function(db, callback) {
  db.runSql('DELETE FROM pages WHERE id IN (1, 2, 3, 4, 5, 6, 7)');
  callback();
};

exports._meta = {
  "version": 1
};
