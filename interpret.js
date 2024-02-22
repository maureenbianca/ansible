'use strict';

const USER_LINE_REGEX = /(.*)\ follows\ (.*)/i;
const TWEET_LINE_REGEX = /^(.*)>\ (.*)$/i;

const logger = require('winston');
const EventEmitter = require('events');
const async = require('async');
const readline = require('readline');
const argv = require('optimist')
  .usage('Usage: $0 -t tweet-file.txt -u user-file.txt')
  .demand(['t', 'u'])
  .argv;
const fs = require('fs');

logger.cli();
logger.level = process.env.LOG_LEVEL || 'debug';

logger.debug(': argv: %j', argv);

var user_list = {};

class StagesEmitter extends EventEmitter { };
const StagesEvents = new StagesEmitter();
StagesEvents.setMaxListeners(2);

const user_file = argv['u'];
const tweet_file = argv['t'];

const read_user_file = (cb) => {
  logger.info(': Reading user file...');
  // Read user file
  let userFileReader = readline.createInterface({
    input: fs.createReadStream(user_file)
  });
  userFileReader.on('line', line => {
    let line_result = line.match(USER_LINE_REGEX);
    logger.debug(': line : %s', line);
    logger.debug('> Line Result : %j', line_result);
    let user_name = line_result[1];
    // Check if user exists in the users list
    if (! user_list.hasOwnProperty(user_name)) {
      user_list[user_name] = {
        follows: [],
        timeline: []
      };
    }
    line_result[2].split(',').forEach((value, index) => {
      value = value.replace(/ /g, '');
      if (user_list[user_name].follows.indexOf(value) == -1) {
        user_list[user_name].follows.push(value);
      }
    });
  });
  userFileReader.on('close', () => {
    logger.debug(': user_list: %j', user_list);
    if (!process.env.UNIT_TEST) {
      /* istanbul ignore next */
      StagesEvents.emit('read_tweet_file', tweet_file);
    } else {
      cb(user_list);
    }
  });
}

const read_tweet_file = (cb) => {
  logger.info(': Reading tweet file...');
  logger.debug(': user_list: %j', user_list);
  let tweetFileReader = readline.createInterface({
    input: fs.createReadStream(tweet_file)
  });
  tweetFileReader.on('line', line => {
    let line_result = line.match(TWEET_LINE_REGEX);
    logger.debug(': line : %s', line);
    logger.debug('> Line Result : %j', line_result);
    let tweeter = line_result[1];
    let tweet = line_result[2];
    Object.keys(user_list).forEach((value) => {
      let user = user_list[value];
      logger.debug(': user : %j', user);
      if (user.follows.indexOf(tweeter) > -1 || value === tweeter) {
        if (tweet.length > 140) {
          /* istanbul ignore next */
          logger.error(`${tweet} by ${tweeter} exceeds the 140 character limit`);
        } else {
          user_list[value].timeline.push(`@${tweeter}: ${tweet}`);
        }
      }
    });
  });
  tweetFileReader.on('close', () => {
    logger.debug(': user_list: %j', user_list);
    if (!process.env.UNIT_TEST) {
      /* istanbul ignore next */
      StagesEvents.emit('show_timelines');
    } else {
      cb(user_list);
    }
  });
};

/* istanbul ignore next */
const show_timelines = () => {
  logger.info('------------------------------------');
  Object.keys(user_list).forEach((value) => {
    let user = user_list[value];
    logger.info(`Timeline for @${value}`);
    user.timeline.forEach((timeline_entry) => {
      logger.info(`\t${timeline_entry}`);
    })
    logger.info('------------------------------------');
  });
};

StagesEvents.on('read_user_file', read_user_file);
StagesEvents.on('read_tweet_file', read_tweet_file);
StagesEvents.on('show_timelines', show_timelines);

if (!process.env.UNIT_TEST) {
  /* istanbul ignore next */
  StagesEvents.emit('read_user_file', user_file);
}

// Exports needed for unit tests
module.exports = { read_user_file, read_tweet_file, show_timelines, user_list };
