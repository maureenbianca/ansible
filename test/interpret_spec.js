'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const logger = require('winston');

const root_path = process.cwd();

logger.cli();
logger.level = process.env.LOG_LEVEL || 'debug';

beforeEach(() => {
  this.sandbox = sinon.createSandbox();
  this.interpreter = require('../interpret');
});

afterEach(() => {
  this.sandbox.restore();
});

const add_file_arguments = () => {
  process.argv.push('-u')
  process.argv.push(`${root_path}/test/samples/user.txt`);
  process.argv.push('-t');
  process.argv.push(`${root_path}/test/samples/tweet.txt`);
};

add_file_arguments();

describe('read user file', () => {
  it('is able to read the user file', () => {
    this.interpreter.read_user_file(user_list => {
      expect(user_list).to.eql({ 'Ward': { 'follows': ['Alan'], 'timeline': [] } });
    });
  });
});

describe('read tweet file', () => {
  it('is able to read the tweet file', () => {
    this.interpreter.read_tweet_file(user_list => {
      logger.debug('unit test user_list: %j', user_list);
      expect(user_list).to.eql({ 'Ward': { 'follows': ['Alan'], 'timeline': ['@Alan: If you have a procedure with 10 parameters, you probably missed some.'] } });
    });
  });
});
