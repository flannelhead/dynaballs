var graphics = {
    computeFieldFromPrecomputed: function(balls, fields, ctx, width, height) {
        var imageData = ctx.createImageData(width, height),
            data = imageData.data, threeWidth = 3 * width,
            offsets = [], offset, field, n = 0, index = 0,
            R, G, B, len, x, y, i;

        for (i = 0, len = balls.length; i < len; i++) {
            offsets[i] = 3 * (Math.floor(height - balls[i].y0) * 2 * width +
                Math.floor(width - balls[i].x0));
        }

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                R = G = B = 0;
                for (i = 0; i < len; i++) {
                    field = fields[i];
                    offset = offsets[i] + index;
                    R += field[offset];
                    G += field[offset + 1];
                    B += field[offset + 2];
                }
                index += 3;
                data[n++] = R;
                data[n++] = G;
                data[n++] = B;
                data[n++] = 255;
            }
            index += threeWidth;
        }

        return imageData;
    },

    computeField: function(balls, ctx, width, height) {
        var imageData = ctx.createImageData(width, height),
            data = imageData.data, len = balls.length,
            n = 0, RGB, R, G, B, coeff, x, y, i;

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                R = G = B = 0;
                for (i = 0; i < len; i++) {
                    RGB = balls[i].RGB;
                    coeff = balls[i].f(x, y);
                    R += coeff * RGB.R;
                    G += coeff * RGB.G;
                    B += coeff * RGB.B;
                }
                data[n++] = R;
                data[n++] = G;
                data[n++] = B;
                data[n++] = 255;
            }
        }

        return imageData;
    },

    HSVtoRGB: function(H, S, V) {
        // http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
        var C = V * S,
            Hprime = 6 * H,
            X = C * (1 - Math.abs(Hprime % 2 - 1)),
            m = V - C, RGB;

        if (Hprime < 1) RGB = { R: C, G: X, B: 0 };
        else if (Hprime < 2) RGB = { R: X, G: C, B: 0 };
        else if (Hprime < 3) RGB = { R: 0, G: C, B: X };
        else if (Hprime < 4) RGB = { R: 0, G: X, B: C };
        else if (Hprime < 5) RGB = { R: X, G: 0, B: C };
        else RGB = { R: C, G: 0, B: X };

        RGB.R += m;
        RGB.G += m;
        RGB.B += m;
        RGB.R *= 255;
        RGB.G *= 255;
        RGB.B *= 255;

        return RGB;
    }
};
