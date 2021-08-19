const emailService = require("../../services/email.service");
const { SEND_EMAIL } = require("../../utils/constants/job.constant");

module.exports = (agenda) => {
  agenda.define(SEND_EMAIL, async (job) => {
    const { data } = job.attrs;
    await emailService.sendEmail(data);
  });
};
