const { getVideoById } = require('./get_video');

/**
 * Method for get user by id
 * @param dependencies {Object} project dependencies
 * @param id {String} id of video
 * @return {Object} user
 */
exports.getUser= async (dependencies, id) => {
  const {logger, database} = dependencies;
  try {
    const video = await getVideoById(dependencies, id);
    return database.user.get(video.user);
  } catch (e) {
    const message = `Error in getting authorization ${id} with error ${e}`;
    logger.error(message);
    throw message; 
  }
};