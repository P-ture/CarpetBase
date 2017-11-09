const argon2 = require('argon2');
const csprng = require('csprng');

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

exports.up = async function(db, callback) {
  const salt = csprng(160, 36);
  const password = await argon2.hash(process.env.CARPETBASE_PW);
  db.insert('users', ['salt', 'username', 'password'], [salt, 'admin', password], callback);
};

exports.down = async function(db, callback) {
  await db.runSql('DELETE FROM users where username = "admin" LIMIT 1');
  callback();
};

exports._meta = {
  "version": 1
};
