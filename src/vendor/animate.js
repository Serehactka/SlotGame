module.exports = function animate(options) {
    const step = options.step || null;
    const complete = options.complete || null;
    const bezier = options.bezier || null;

    const delay = options.delay;
    const startTime = new Date().getTime();
    var elapsedTime = 0;

    var from = options.from || 0;
    var to = options.to || 0;
    var tickStep = (to - from) / delay || options.tickStep || 0;
    var range = tickStep * delay;
    var elapsedValue = 0;

    function updateTime() {
        elapsedTime = new Date().getTime() - startTime;
        elapsedTime > delay && (elapsedTime = delay);
    }

    function getState() {
        return elapsedTime / delay;
    }

    function tick() {
        updateTime();

        const currentState = getState();
        var valueFactor = bezier && bezier(currentState);

        valueFactor = valueFactor || currentState;

        const currentValue = range * valueFactor;
        const tickStep = currentValue - elapsedValue;
        elapsedValue = currentValue;

        step && step(tickStep, elapsedValue);

        if (!checkTime()) {
            onComplete();

            return null;
        }
    
        requestAnimationFrame(tick);
    }

    function checkTime() {
        return elapsedTime < delay;
    }

    function onComplete() {
        complete && complete();
    }

    tick();
}

// const options = {
//     from: 0,
//     to: 150,
//     delay: 1000,
//     tickStep: 10,
//     bezier: function() {

//     },
//     step: function(step, val) {
//         console.log('step');
//     },
//     complete: function() {
        
//     }
// }

// function sinBezier(factor) {
//     return 1 - Math.sin(Math.PI/2 * factor);
// }