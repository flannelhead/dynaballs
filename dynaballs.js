window.addEventListener('load', function() {
    var canvas = document.getElementById('main'), ctx = canvas.getContext('2d'),
        timestamp = null, safeTimeout = 200, reqId = null,
        balls, mouseBall, frameCount = 0, sampleTime = 0, remainder = 0,
        timestep = 5,  // timestep of integration in ms
        fps = document.getElementById('fps'),
        potential = document.getElementById('potential'),
        precision = document.getElementById('precision'),
        canvasContainer = canvas.offsetParent;

    var keyActions = {
        'restart': {
            callback: restart,
            description: 'restart'
        },
        'add-ball': {
            callback: addBall,
            description: 'add a ball'
        },
        'remove-ball': {
            callback: removeBall,
            description: 'remove a ball'
        },
        'toggle-potential': {
            callback: togglePotential,
            description: 'toggle potential'
        },
        'toggle-precision': {
            callback: togglePrecision,
            description: 'toggle precision'
        }
    };

    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    function draw(time) {
        var dt, nSteps, imageData;

        if (timestamp === null) timestamp = time;
        dt = time - timestamp;
        // Prevent the simulation from jamming because of a too long timestep
        if (dt > safeTimeout) dt = 0;
        timestamp = time;
        frameCount++;
        sampleTime += dt;
        if (sampleTime > 1000) {
            fps.textContent = (1000 * frameCount / sampleTime).toFixed(1);
            sampleTime = 0;
            frameCount = 0;
        }

        if (config.highPrecision === true) {
            imageData = graphics.computeField(metaballs.balls, ctx,
                config.width, config.height);
        } else {
            imageData = graphics.computeFieldFromPrecomputed(metaballs.balls,
                metaballs.fields, ctx, config.width, config.height);
        }
        ctx.putImageData(imageData, 0, 0);

        dt += remainder;
        nSteps = Math.floor(dt / timestep);
        remainder = dt - nSteps * timestep;
        while (nSteps--) {
            dynamics.takeTimestep(metaballs.balls, timestep, config);
        }

        reqId = window.requestAnimationFrame(draw);
    }

    function cancelFrame() {
        if (reqId !== null) {
            window.cancelAnimationFrame(reqId);
            reqId = null;
        }
    }

    function requestFrame() {
        reqId = window.requestAnimationFrame(draw);
    }

    function init() {
        refreshPotential();
        initBalls();
        refreshPrecision();

        keybindings.listBindings(config.keybindings, keyActions,
            document.getElementById('keys'));
        keybindings.bindKeys(config.keybindings, keyActions);

        canvas.addEventListener('mousemove', function(event) {
            mouseBall.x0 = event.clientX - canvas.offsetLeft -
                canvasContainer.offsetLeft;
            mouseBall.y0 = event.clientY - canvas.offsetTop -
                canvasContainer.offsetTop;
        });

        requestFrame();
    }

    function initBalls() {
        metaballs.generateBalls(config);
        mouseBall = metaballs.balls[0];
        mouseBall.oneOverR2 = 0;
    }

    function restart() {
        cancelFrame();
        initBalls();
        refreshPrecision();
        requestFrame();
    }

    function addBall() {
        cancelFrame();
        config.nBalls++;
        metaballs.addNonCollidingBall(config);

        requestFrame();
    }

    function removeBall() {
        if (metaballs.balls.length === 1) return;

        cancelFrame();
        config.nBalls--;
        metaballs.popBall();
        requestFrame();
    }

    function togglePotential() {
        cancelFrame();

        if (config.potential === 'repulsive') {
            config.potential = 'attractive';
        } else {
            config.potential = 'repulsive';
        }
        refreshPotential();
        metaballs.computeCoefficients(config.k);

        requestFrame();
    }

    function togglePrecision() {
        cancelFrame();

        if (config.highPrecision === true) {
            config.highPrecision = false;
        } else {
            config.highPrecision = true;
        }
        refreshPrecision();

        requestFrame();
    }

    function refreshPotential() {
        if (config.potential === 'repulsive') {
            config.k = config.kRepulsive;
            potential.textContent = 'repulsive';
        } else {
            config.k = config.kAttractive;
            potential.textContent = 'attractive';
        }
    }

    function refreshPrecision() {
        if (config.highPrecision === true) {
            precision.textContent = 'on';
            metaballs.discardFields();
        } else {
            precision.textContent = 'off';
            metaballs.precomputeFields(config);
        }
    }

    init();
});
