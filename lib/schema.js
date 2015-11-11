
var Joi = require('joi');
var _ = require('lodash');
var config = require('../config.json');

exports.options = Joi.object().keys({
  ip_address       : Joi.string(),
  datetime         : Joi.number().integer(),
  user_type        : Joi.any().valid(_.values(config.userType)).required(),
  user_name        : Joi.string(),
  user_id          : Joi.string(),
  account          : Joi.string(),
  account_id       : Joi.array(),
  activity_type    : Joi.any().valid(_.values(config.activityType)).required(),
  activity_target  : Joi.any().valid(_.values(config.activityTarget)).required(),
  target_name      : Joi.string(),
  target_id        : Joi.string(),
  operation_status : Joi.any().valid(_.values(config.operationStatus)).required(),
  target_object    : Joi.object()
});
