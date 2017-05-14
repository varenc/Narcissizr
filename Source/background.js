
console.warn('backgrounjs running!');

function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}


chrome.browserAction.onClicked.addListener(function(tab) {
        console.warn('tab', tab);
	    executeScripts(null, [{file: "names.js"},
							  {file: "content_script.js"}]
					  );
});
