/**
 * Method for get video by id
 * @param dependencies {Object} project dependencies
 * @param id {String} id of video
 * @return {Object} video
 */
exports.getVideoById = async (dependencies, id) => {
  const {logger, database} = dependencies;
  try {
    return database.video.get(id);
  } catch (e) {
    const message = `Error in getting video ${id} with error ${e}`;
    logger.error(message);
    throw message; 
  }
};