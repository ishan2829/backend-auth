import sanitizeHtml from 'sanitize-html';
import Joi from 'joi';

// source: https://stackoverflow.com/a/70019887
export default Joi.extend((joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.htmlStrip': '{{#label}} should not contain any html tags',
  },
  rules: {
    htmlStrip: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value);
        if (clean === value) {
          return clean;
        }
        return helpers.error('string.htmlStrip');
      },
    },
  },
}));
