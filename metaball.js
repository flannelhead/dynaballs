var metaballs = {
    metaball: {
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,

        // Function for computing the colouring field
        f: function(x, y) {
            var dx = x - this.x0,
                dy = y - this.y0,
                r2 = dx * dx + dy * dy;

            if (r2 < this.R2) return 1;

            return this.R2 / r2;
        },

        // Computes the magnitude of the force field derived from the
        // interaction potential at the distance r
        F: function(r) {
            if (r > this.Rwell) {
                return this.R2 / (r * r);
            }
            return this.R2 * r * (this.a * r + this.b);
        },

        computeCoefficients: function(k) {
            // Constants for repulsive part of the interaction potential
            this.a = 3 * (2 * k * this.Rwell + 3) /
                Math.pow(this.Rwell, 4);
            this.b = 1 / Math.pow(this.Rwell, 3) - this.a * this.Rwell;
        },

        randomize: function(config) {
            var ball = Object.create(this);

            ball.R = config.rMin + Math.round(Math.random() *
                (config.rMax - config.rMin));
            ball.Rcoll = Math.round(config.rColl * ball.R);
            ball.Rwell = Math.round(config.rWell * ball.R);
            ball.R2 = ball.R * ball.R;
            ball.oneOverR2 = 1 / ball.R2;

            ball.computeCoefficients(config.k);

            ball.x0 = ball.R + Math.round(Math.random() *
                (config.width - 2 * ball.R));
            ball.y0 = ball.R + Math.round(Math.random() *
                (config.height - 2 * ball.R));

            ball.RGB = graphics.HSVtoRGB(config.hMin +
                (config.hMax - config.hMin) * Math.random(), 1, 1);

            return ball;
        },
    },

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
            newBall = this.metaball.randomize(config);
        } while (this.collidesOthers(newBall));
        this.balls.push(newBall);
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
    }
};
