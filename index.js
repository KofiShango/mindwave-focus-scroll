const { createClient } = require("node-thinkgear-sockets");
const debounce = require('debounce');
const robot = require("robotjs");

const brain = createClient({ enableRawOutput: false });

let debugLogging = true;
let scrolling = false

/**
 * Debounce toggle by 2 sec
 * to keep from spamming scroll.
 */
const scroll = debounce(()=>{
    console.log("Scrolling");
    scrolling = true;
    // robot.scrollMouse(0, -50); // Why doesnt this work 🙃
    for(let i=0; i<15; i++){
        robot.keyTap('down');
    }
    scrolling = false;
}, 2000, true);

brain.connect();

// Focus logic
console.log("Focus mode active. Relax to scroll Focus to stop scrolling.");
brain.on('data', data=>{
    const attention = data && data.eSense && data.eSense.attention;
    const meditation = data && data.eSense && data.eSense.meditation;
    debugLogging && console.log("meditation: ", meditation);
    debugLogging && console.log('attention: ', attention)

    if(scrolling){
        // Higher standard if scrolling currently
        if(attention < 25 && meditation > 65){
            scroll();
        }
    }else{
        // Lower standard if not scrolling
        if(attention < 45 && meditation > 50) {
            scroll();
        }
    }
})
