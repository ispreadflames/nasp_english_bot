const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    WEBHOOK_URL: Joi.string().required(),
    USERNAME: Joi.string().required(),
    BOT_TOKEN: Joi.string().required(),
    MONGODB_URL: Joi.string().required(),
    CHANNEL_ID: Joi.string().required(),
    CLOUD_NAME: Joi.string().required(),
    COULDINRAY_API_KEY: Joi.string().required(),
    CLOUDINARY_API_SECRET: Joi.string().required(),
    CLOUDINARY_URL: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  botToken: envVars.BOT_TOKEN,
  username: envVars.USERNAME,
  webHook: `${envVars.WEBHOOK_URL}/bot${envVars.BOT_TOKEN}`,
  webHookUrl: envVars.WEBHOOK_URL,
  mongoUri: envVars.MONGODB_URL,
  channelId: envVars.CHANNEL_ID,
  cloudName: envVars.CLOUD_NAME,
  cloudinaryApiKey: envVars.COULDINRAY_API_KEY,
  cloudinaryApiSecret: envVars.CLOUDINARY_API_SECRET,
  cloudinaryUrl: envVars.CLOUDINARY_URL,
};
