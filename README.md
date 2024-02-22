[![pipeline status](https://gitlab.com/jc1arke/tweet-interpreter/badges/master/pipeline.svg)](https://gitlab.com/jc1arke/tweet-interpreter/commits/master)
[![coverage report](https://gitlab.com/jc1arke/tweet-interpreter/badges/master/coverage.svg)](https://gitlab.com/jc1arke/tweet-interpreter/commits/master)

## Quick start

Run `npm install` to install all the needed packages.

Once complete, run `npm start -u <user_file.txt> -t <tweet_file.txt>` in order to run the application, substituting `user_file.txt` and `tweet_file.txt` with the respective file paths. If you set `LOG_LEVEL=info` it will disable the debug output.

### Example output

```bash
% LOG_LEVEL=info yarn start -t samples/tweet.txt -u samples/user.txt
$ node interpret.js -t samples/tweet.txt -u samples/user.txt
info:    : Reading user file...
info:    : Reading tweet file...
info:    ------------------------------------
info:    Timeline for @Ward
info:           @Alan: If you have a procedure with 10 parameters, you probably missed some.
info:           @Ward: There are only two hard things in Computer Science: cache invalidation, naming things and off-by-1 errors.
info:           @Alan: Random numbers should not be generated with a method chosen at random.
info:    ------------------------------------
info:    Timeline for @Alan
info:           @Alan: If you have a procedure with 10 parameters, you probably missed some.
info:           @Alan: Random numbers should not be generated with a method chosen at random.
info:    ------------------------------------
✨  Done in 0.20s.
```

### Testing

Simply run `npm test`