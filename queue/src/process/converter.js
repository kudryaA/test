const { getVideoById } = require('../utills/get_video');
const { getUser } = require('../utills/get_user');
const { submitJob } = require('../utills/aws_batch_submit')

/**
 * Run convert video procedure
 * @param dependencies {Object} project dependencies
 * @param id {String} id of video
 * @param additional {Object} additional data
 */
exports.videoConvert = async (dependencies, id, additional) => {
  const {logger} = dependencies;
  try {
    let video_path = additional.video_path;
    let save_video_path = additional.save_video_path;
    const body = await getVideoById(dependencies, id);
    let aws_bucket_name = (await getUser(dependencies, id)).Bucket;
    if (!video_path) {
      video_path = body.video_path;
    }
    if (!save_video_path) {
      save_video_path = body.bucket_path;
    }

    const params = {
      jobDefinition: 'vc-def',
      jobName: `vc-job-${id}`,
      jobQueue: 'vc-queue',
      parameters: {
        next: 'true',
        video_id: id,
        video_url: video_path,
        mode: dependencies.mode,
        aws_bucket_name,
        save_video_path
      }
    };
    submitJob(dependencies, 'vc', id, params);
  } catch (e) {
    logger.error(`Error in converting video ${id} with ${e}`);
  }
};