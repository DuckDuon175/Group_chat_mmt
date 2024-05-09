const RecordService = require("../services/RecordService");
class RecordMiddleware {
  validateRecord(req, res, next) {
    const validation = RecordService.validateRecord(req.body).error;
    if (validation === undefined) {
      console.log("Validate successful!");
      next();
    } else {
      return res.status(400).json({
        message: validation.details[0].message,
      });
    }
  }

  async checkId(req, res, next) {
    const recordById = await RecordService.getRecordById(req.params.recordId);
    if (recordById.length === 0)
      return res.status(404).json({
        message: "Record not existed!",
      });
    next();
  }

  async checkUserId(req, res, next) {
    const recordByUserId = await RecordService.getRecordByUserId(
      req.params.userId
    );
    if (recordByUserId.length === 0)
      return res.status(404).json({
        message: "Record not existed!",
      });
    next();
  }

  async checkDeviceId(req, res, next) {
    const recordByDeviceId = await RecordService.getRecordByDeviceId(
      req.params.userId
    );
    if (recordByDeviceId.length === 0)
      return res.status(404).json({
        message: "Record not existed!",
      });
    next();
  }

  async checkStartTime(req, res, next) {
    if (isNaN(Number(req.params.time)))
      return res.status(400).json({
        message: "Time is not a number!",
      });
    const recordByStartTime = await RecordService.getRecordByStartTime(
      req.params.time
    );
    if (recordByStartTime.length === 0)
      return res.status(404).json({
        message: "Record not existed!",
      });
    next();
  }

  async checkEndTime(req, res, next) {
    if (isNaN(Number(req.params.time)))
      return res.status(400).json({
        message: "Time is not a number!",
      });
    const recordByStartTime = await RecordService.getRecordByEndTime(
      req.params.time
    );
    if (recordByStartTime.length === 0)
      return res.status(404).json({
        message: "Record not existed!",
      });
    next();
  }
}

module.exports = new RecordMiddleware();
