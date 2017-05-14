console.warn('CONTENT_SCRIPT IS RUNNING!!');

var observer;
var observerConfig = { subtree: true, childList: true, characterData: true };
function observerConnect() {
    observer.observe(document.body, observerConfig);
}

chrome.storage.sync.get({
    firstName: 'Chris',
    lastName: 'Varenhorst',
}, function(items) {
    window.firstName = items.firstName;
    window.lastName = items.lastName;
    walk(document.body);

    observer = new MutationObserver(processMutations);
    observerConnect();

});

function processMutations(mutations) {
	mutations.forEach(function(mut) {
		switch(mut.type) {
			case 'characterData':
			    observer.disconnect();
				walk(mut.target);
                observerConnect();
				break;
			case 'childList':
                for(var j=0; j<mut.addedNodes.length; ++j) {
                    var node = mut.addedNodes[j];
                    observer.disconnect();
                    walk(node);
                    observerConnect();
                }
				break;
		}
	});
}

function walk(node)
{
    // I stole this function from here:
    // http://is.gd/mwZp7E

    var child, next;

    switch ( node.nodeType )
    {
        case 1:  // Element
        case 9:  // Document
        case 11: // Document fragment
            child = node.firstChild;
            while (child)
            {
                next = child.nextSibling;
                walk(child);
                child = next;
            }
            break;

        case 3: // Text node
            if (!node.parentNode.dataset.narcprocessed) {
                node.parentNode.dataset.narcprocessed = 0;
            }
            // in theory this counts the number of txt nodes
            if (node.parentNode.dataset.narcprocessed >= node.parentNode.childNodes.length - node.parentNode.children.length) {
                break;
            }
            handleText(node);
            node.parentNode.dataset.narcprocessed++;
            break;
    }
}

function handleText(textNode)
{
    var v = textNode.nodeValue;
    console.log("VALUE=",v);
    if (v.search('Varenhorst') != -1) {
        console.log("about to process this node but Varenhorst is already in it!", v);
    }
    if (v.search('Mallon') != -1) {
        debugger;
    }
    v = veryDumbMatching(v);
    if (v != textNode.nodeValue) {
        console.log('updating ', textNode.nodeValue, 'to', v);
        textNode.nodeValue = v;
    }
}

function veryDumbMatching(text) {
    //now, this is a story all about how
    //my code got flipped turned upside down
    //it'll take a couple lines
    //just stay in your chair
    //i'll tell you how i am came to write all the sad code down there

    chunks = text.split(/[,!\?]/);
    for (chunk of chunks) {
        words = chunk.split(/[\s,\.!]+/);
        for (var i=0; i<=words.length; i++) {
            var w = words[i];
            if (checkMatch(w)) {
                text = text.replace(w, matchCase(w, firstName));
		//                console.log('SWAPPING', w, 'for', firstName);
                index = 1;
                while(true) {
                    var nextWord = words[i+index];
                    if (! (checkInitial(nextWord) || couldBeName(nextWord))) {
                        break;
                    }
                    if (checkInitial(nextWord)) {
                        nextWord = words[i + ++index]; // i'm sorry
                    }
                    if (couldBeName(nextWord)) {
			//                        console.log(nextWord, 'could be a name...so swapping with', matchCase(nextWord, lastName));
                        text = text.replace(nextWord, matchCase(nextWord, lastName));
                        index++;
                    }
                    break;
                }
            }
        }
    }

    // text = text.replace(/[ØA-Z-]\w+\s{1,4}Chris/g,firstName + " " + lastName) //HACK!
    text = text.replace(new RegExp("("+ lastName + "[\\s]*){2,}","g"),"$1") //HACK!
    text = text.replace(new RegExp("("+ lastName.toUpperCase() + "[\\s]*){2,}","g"),"$1") //HACK!
    text = text.replace(new RegExp("("+ firstName + "[\\s]*){2,}","g"),"$1") //HACK!
    text = text.replace(new RegExp("("+ firstName.toUpperCase() + "[\\s]*){2,}","g"),"$1") //HACK!
    return text;
}

function matchCase(match, swap) {
    if (match.toUpperCase() == match) {
	//        console.log("MATCH CASE!", swap);
        return swap.toUpperCase();
    }
    return swap;
}
function checkInitial(word) {
    return word && word.match(/^[A-Z]\.?$/);
}
function swapInitial(text, word) {
    //assert(checkInitial(word));
    word = word.match("[A-Z]")[0];
    var re = new RegExp(word+"(.?\W)","g");
    return text.replace(re, "J$1");
}
function couldBeName(word) {
    return word && word[0] && word[0].toUpperCase() == word[0];
}

function checkMatch(w) {
    if (!(w && w[0])) {
        return false;
    }
    w.replace(/[-]/,"");
    return w && w[0] && w[0].toUpperCase() == w[0] && all_names.has(w.toLowerCase());
}

