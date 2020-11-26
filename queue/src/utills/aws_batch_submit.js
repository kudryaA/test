/**
 * Method for job submitting
 * @param dependencies {Object} project dependencies
 * @param name {String} name of process
 * @param id {String} id of video
 * @param params {Object} parameter for job submitting
 */
exports.submitJob = (dependencies, name,id , params)=> {
  const {logger, batch, database} = dependencies;
  batch.submitJob(params, (err, data) => {
    if (err) logger.error(`Error in submitting job ${name} for video ${id} with error ${err}`);
    else {
      database.aws.saveSubmitJobHistory(id, data);
      logger.info(`Successful submitting job ${name} for video ${id} ${JSON.stringify(data)}`);
    }
  });
}