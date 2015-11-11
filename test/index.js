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
/*jslint mocha: true */

'use strict';

var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var _ = require('lodash');
var LoggerAudit = require('../lib/index.js');
var Winston = require('winston');

var assert = chai.assert;
var expect = chai.expect;

var failureObject = {};
var failureObject2 = {
  mongodb: {
    db: 'some config',
    collection: 'some collection'
  }
};
var failureObject3 = {
  mongodb: {
    collection: 'some collection'
  },
  file: {
    timestamp: 'some boolean'
  }
};
var failureObject4 = {
  mongodb: {
    db: 'some config',
    collection: 'some collection'
  },
  file: {
    filename: 'some filename',
    timestamp: 'some boolean'
  }
};
var correctObject = {
  mongodb: {
    db: 'mongodb://TESTSJC20-CMDB01.REVSW.NET:27017/revportal?replicaSet=CMDB-rs0',
    collection: 'qa_audit_events'
  },
  file: {
    filename: 'log/qa_audit_events',
    timestamp: true
  }
};

describe('Test initialization', function() {

  it('Should not be initialized', function() {
    var result = LoggerAudit.init(failureObject);
    assert.equal(result, false);
  });

  it('Should not be initialized', function() {
    var result = LoggerAudit.init(failureObject2);
    assert.equal(result, false);
  });

  it('Should not be initialized', function() {
    var result = LoggerAudit.init(failureObject3);
    assert.equal(result, false);
  });

  it('Should not be initialized (transport error)', function() {
    var result = LoggerAudit.init(failureObject4);
    assert.equal(result, false);
  });

  it('Should be initialized', function() {
    var result = LoggerAudit.init(correctObject);
    assert.equal(result, true);
  });

  describe('Testing store operation', function() {

    before(function() {
      sinon.spy(Winston, 'info');
    });

    after(function () {
      Winston.info.restore();
    });

    it('store should send an error if validation mismatched', function (done) {
      LoggerAudit.store(function(err) {
        assert.ok(err);
        done();
      });
    });

    it('AuditLogger.store should call winston.info', function () {
      LoggerAudit.store({
        user_type: LoggerAudit.config.userType.user,
        account_id: [],
        activity_type: LoggerAudit.config.activityType.add,
        activity_target: LoggerAudit.config.activityTarget.user,
        operation_status: LoggerAudit.config.operationStatus.success,
        target_object: {}
      });
      assert(Winston.info.called);
    });

  });

  describe('logUserAdd method', function() {

    before(function() {
      sinon.spy(LoggerAudit, 'store');
    });

    after(function () {
      LoggerAudit.store.restore();
    });

    it('logUserAdd method should call LoggerAudit.store', function () {
      LoggerAudit.logUserAdd({});
      assert(LoggerAudit.store.called);
    });

  });

});
