'use strict';

/**
 * `on-summary-create` middleware
 */

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('In on-summary-create middleware.');

    await next();
  };
};
