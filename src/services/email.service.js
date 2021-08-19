const nodemailer = require("nodemailer");

const { SEND_EMAIL } = require("../utils/constants/job.constant");
const tokenService = require("./token.service");
const { agenda } = require("../loaders/agenda");
const systemLog = require("../loaders/logger");
const config = require("../loaders/configs");

const transport = nodemailer.createTransport(config.email.smtp);

if (config.env !== "production") {
  transport
    .verify()
    .then(() => {})
    .catch(() =>
      systemLog.warn(
        "Unable to connect to email server. Check configured the SMTP options in .env"
      )
    );
}

const sendEmail = async (info) => {
  const { to, subject, payload } = info;
  systemLog.info(`Sending Email to ${to} - START`);
  try {
    const msg = {
      from: config.email.from,
      to,
      subject,
      text: payload.text,
    };
    await transport.sendMail(msg);
    systemLog.info(`Sent to email ${to} - SUCCESS`);
  } catch (error) {
    systemLog.error(`Sending Email ${to} - FAIL`);
    systemLog.error(error);
  }
};

const sendResetPasswordEmail = async (to, token) => {
  systemLog.info(`Generate reset email token for ${to} - START`);
  try {
    const url = `http://localhost:3000/reset-password?token=${token}`;
    const text = `Dear user,
    To reset your password, click on this link: ${url}
    If you did not request any password resets, then ignore this email.`;

    agenda.now(SEND_EMAIL, {
      to,
      subject: "[ RESET PASSWORD ]",
      payload: { text },
    });

    systemLog.info(`Generate reset email token for ${to} - SUCCESS`);
  } catch (error) {
    systemLog.error(`Generate reset email token for ${to} - FAIL`);
    systemLog.error(error);
  }
};

const sendVerifyEmail = async (newUser) => {
  systemLog.info(`Generate verify email token for ${newUser.email} - START`);
  try {
    const { email, name } = newUser;
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(
      newUser
    );
    const verifyUrl = `http://localhost:8000/api/verify-email?token=${verifyEmailToken}`;
    const text = `Hi ${name}, Please click the link to verify email: ${verifyUrl}`;

    agenda.now(SEND_EMAIL, {
      to: email,
      subject: "[ EMAIL VERIFICATION ]",
      payload: { text },
    });

    systemLog.info(
      `Generate verify email token for ${newUser.email} - SUCCESS`
    );
  } catch (error) {
    systemLog.info(`Generate verify email token for ${newUser.email} - FAIL`);
    systemLog.error(error);
  }
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerifyEmail,
};
