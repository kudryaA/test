const { getVideoById } = require('../utills/get_video');
const { submitJob } = require('../utills/aws_batch_submit')

/**
 * Run find odometr
 * @param dependencies {Object} project dependencies
 * @param id {String} id of video
 * @param additional {Object} additional data
 */
exports.find = async (dependencies, id, additional) => {
  const {logger} = dependencies;
  try {
    const body = await getVideoById(dependencies, id);
    const { video_path } = body;
    const params = {
      jobDefinition: 'oa-def',
      jobName: `oa-job-${id}`,
      jobQueue: 'oa-queue',
      parameters: {
        next: 'true',
        video_id: id,
        video_url: video_path,
        mode: dependencies.mode
      }
    };
    submitJob(dependencies, 'oa', id, params);
  } catch (e) {
    logger.error(`Error in odometr video ${id} with ${e}`);
  }
};