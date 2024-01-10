const ROLES = { user: 'USER', admin: 'ADMIN' };
const SEXES = ['Male', 'Female'];
const LANGUAGES = {
  en: 'en',
  am: 'am',
  fr: 'fr',
};

const ERROR_TYPES = {
  un_authorized: 'UNAUTHORIZED',
  blocked: 'BLOCKED',
  post_more_than_allowed_images: 'POST_MORE_THAN_ALLOWED_IMAGES',
  upload_limit_exceeded: 'UPLOAD_LIMIT',
};

module.exports = { ROLES, SEXES, LANGUAGES, ERROR_TYPES };
