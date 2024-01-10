module.exports = ({ validator, value, message, ctx }) => {
  const { error } = validator.validate(value);
  if (error) {
    ctx.reply(message || 'Error Happened!');
    return false;
  }
  return true;
};
