const fs = require("fs");
const path = require("path");
const async = require("async");

const { isValidUser, addUserToDb, logUserInfoToDb, addMembershipStatusToDb } = require('./queries');

function migrateUsers(finalCallback) {
  const userData = Object.values(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json'));

  async.map(userData, migrateUser, (err, results) => {
    if (err) {
      return logger.error("There was an error migrating the users.");
    }
    logger.debug("All users migrated!");
    finalCallback();
  })

  function migrateUser(user, cb) {
    const { id, email, username, password, ip, fingerprint } = user;

    // Store user_id in upper scope so we can access it throughout
    // the function after it's been set
    let user_id;

    isValidUser(name, email, username, password, addUserToDb);

    function addUserToDb(err, status) {
      if (err) {
        return logger.error(err);
      }
      if (!status.valid) {
        return logger.error(status);
      }
      addUser(name, email, username, password, id, logUserInfoToDb);
    }

    function logUserInfoToDb(err, new_user_id) {
      user_id = new_user_id;
      if (err) {
        return logger.error(err);
      }
      logUserInfo(user_id, fingerprint, ip, addMembershipStatusToDb);
    }

    function addMembershipStatusToDb(err) {
      if (err) {
        return logger.error(err);
      }
      changeMembershipStatus(
        user_id,
        "approved",
        "migrated from JSON",
        returnCallback
      );
    }

    function returnCallback(err) {
      if (err) {
        return logger.error(err);
      }
      return cb();
    }
  }
}



module.exports = migrateUsers;