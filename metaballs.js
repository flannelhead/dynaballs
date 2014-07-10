var metaballs = {
    fields: [],
    balls: [],

    computeCoefficients: function(k) {
        var i, len = this.balls.length;
        for (i = 0; i < len; i++) {
            this.balls[i].computeCoefficients(k);
        }
    },

    generateBalls: function(config) {
        var n = config.nBalls;
        this.balls = [];

        while (n--) {
            this.addNonCollidingBall(config);
        }
    },

    addNonCollidingBall: function(config) {
        var newBall;
        do {
            newBall = metaball.createRandomBall(config);
        } while (this.collidesOthers(newBall));

        if (config.highPrecision === false) {
            this.fields.push(newBall.precomputeField(config));
        }

        this.balls.push(newBall);
    },

    popBall: function() {
        this.balls.pop();
        this.fields.pop();
    },

    collidesOthers: function(newBall) {
        var i, len = this.balls.length, dx, dy, curBall, minDist;
        for (i = 0; i < len; i++) {
            curBall = this.balls[i];
            dx = newBall.x0 - curBall.x0;
            dy = newBall.y0 - curBall.y0;
            minDist = newBall.R + curBall.R;
            if (dx * dx + dy * dy < minDist * minDist) return true;
        }
        return false;
    },

    precomputeFields: function(config) {
        var i, len = this.balls.length;
        this.fields = [];
        for(i = 0; i < len; i++) {
            this.fields[i] = this.balls[i].precomputeField(config);
        }
    },

    discardFields: function() {
        this.fields = [];
    }
};
