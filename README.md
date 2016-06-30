RMP
===

This module saves sensors and their values. These can be queried via a REST API.

How to test
===========

1. Run `npm install` if not done
2. Run `npm test`
3. Check if last line starts with `  7 passing`

How to run
==========

1. Run `npm install` if not done
2. Run attached or detached
    - Attached: Run `npm start`
    - Detached: Run `npm start &`

NOTE: Logging happens automatically, and the files are found in the log directory. If you want another log file, you can run following command: `npm start 2>&1 >> $LOGFILE &`
