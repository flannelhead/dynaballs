var metaball = {
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
        // Constants for repulsive / attractive part of the interaction
        // potential
        this.a = 3 * (2 * k * this.Rwell + 3) /
            Math.pow(this.Rwell, 4);
        this.b = 1 / Math.pow(this.Rwell, 3) - this.a * this.Rwell;
    },

    createRandomBall: function(config) {
        var ball = Object.create(this);

        var rMin = Math.round(config.rMin * config.width),
            rMax = Math.round(config.rMax * config.width);

        ball.R = rMin + Math.round(Math.random() * (rMax - rMin));
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

    precomputeField: function(config) {
        var field, xSave, ySave, x, y, f, n = 0,
            width = 2 * config.width, height = 2 * config.height;

        if (Uint8Array) {
            // Compute a colour field covering four times the area of the
            // canvas: 4 * 1 byte * 3 channels = 12
            field = new Uint8Array(new ArrayBuffer(12 *
                config.width * config.height));
        } else {
            field = [];
        }

        xSave = this.x0;
        ySave = this.y0;
        this.x0 = config.width;
        this.y0 = config.height;

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                f = this.f(x, y);
                field[n++] = f * this.RGB.R;
                field[n++] = f * this.RGB.G;
                field[n++] = f * this.RGB.B;
            }
        }

        this.x0 = xSave;
        this.y0 = ySave;
        return field;
    }
};
