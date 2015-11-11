/*************************************************************************
 *
 * REV SOFTWARE CONFIDENTIAL
 *
 * [2013] - [2015] Rev Software, Inc.
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Rev Software, Inc. and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Rev Software, Inc.
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Rev Software, Inc.
 */
/*jslint node: true */

"use strict";

var _       = require('lodash');
var Winston = require('winston');
var MongoDB = require('winston-mongodb').MongoDB;
var Schema  = require('./schema');
var Joi     = require('joi');
var config  = require('../config.json');

/**
 *
 * @constructor
 */
var AuditLogger = {
  /**
   * List of config options
   */
  config: config
};

/**
 * @param {object} object
 */
AuditLogger.init = function (object) {
  var mongodbRequiredKeys = ['db', 'collection'];
  var fileRequiredKeys    = ['filename', 'timestamp'];

  if (
    !_.has(object, 'mongodb') ||
    !_.has(object, 'file') ||
    !_.every(mongodbRequiredKeys, _.partial(_.has, object.mongodb)) ||
    !_.every(fileRequiredKeys,    _.partial(_.has, object.file))
  ) {
    console.log('Incorrect configuration. Please see README.md');
    return false;
  }

  if (!AuditLogger._addTransport(object)) {
    return false;
  }
  return true;
};

/**
 *
 * @param {object} object
 * @private
 */
AuditLogger._addTransport = function (object) {
  try {
    Winston.add(MongoDB, {
      db         : object.mongodb.db,
      collection : object.mongodb.collection
    });

    Winston.add(Winston.transports.File, {
      timestamp : object.file.timestamp,
      filename  : object.file.filename,
    });

  } catch (e) {
    console.log('Add transport error:', e);
    return false;
  }

  return true;
};

/**
 *
 * @param {object} object
 * @param {function} [cb]
 */
AuditLogger.store = function (object, cb) {
  cb = cb || _.noop;
  if (_.isFunction(object)) {
    cb = object;
    object = {};
  }
//  if (!_.isArray(object.domain_id)) {
//    object.domain_id = [object.domain_id];
//  }
  if (!_.isArray(object.account_id)) {
    object.account_id = [object.account_id];
  }
  Joi.validate(object, Schema.options, function (err, value) {
    if (err) {
      console.log(err);
      return cb(err);
    }
    Winston.info(object);
    cb();
  });
};

/**
 * Log 'add' activity to user_type "user"
 *
 * @param  {request} request
 * @param  {string} activityTarget
 * @param  {string} targetId
 * @param  {string} targetName
 * @param  {string} targetObj
 * @param  {string} status
 * @return {*}
 */
AuditLogger.logUserAdd = function(request, activityTarget, targetId, targetName, targetObj, status) {
  return this.store({
    ip_address       : request.info.remoteAddress || '0.0.0.0',
    datetime         : Date.now(),
    user_id          : request.auth.credentials.user_id,
    user_name        : request.auth.credentials.email,
    user_type        : config.userType.user,
    account_id       : request.auth.credentials.companyId,
    activity_type    : config.activityType.add,
    activity_target  : activityTarget,
    target_id        : targetId,
    target_name      : targetName,
    target_object    : targetObj,
    operation_status : status
  });
};

module.exports = AuditLogger;
