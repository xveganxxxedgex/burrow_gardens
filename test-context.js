require('core-js/shim');

/*
*******************************************************************************
    To run the test suite:

    In your terminal, run the command:
*   npm test


    If your tests refuse to run, claiming to be out of memory, update npm and
    node to the latest version globally on your machine.
    If that still doesn't fix the problem, run this:

*		npm test --max-old-space-size=8192


    If tests are unexplicably failing, you can uncomment
    the autoWatch setting in karma.conf.js, run the test command in
    the terminal, then open the link below to watch the status in the console.

*   127.0.0.1:9876/debug.html


    If you don't want to run all tests, you can run individual directories by
    tweaking the require.context, but don't commit that change if you do.

    For example:
* 	var context = require.context('./src/__tests__/actions', false, /\.test\.js$/);

    The line above will only run the files directly in that path. The second
    bool param specifies if you want to test all subdirectories in the path,
    in this case, false meaning we only want the very top level items.

    The third param should always stay the same, it outlines what files we
    want to target based on the file extension.
*******************************************************************************
 */


// All Tests
var context = require.context('./src', true, /\.test\.js$/);

context.keys().forEach(context);