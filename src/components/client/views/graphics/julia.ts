type ComplexNumber = {
    r: number,
    i: number,
};

function complex_add(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    const sum = {
        r: a.r + b.r,
        i: a.i + b.i,
    };
    return sum;
}

function complex_square(z: ComplexNumber): ComplexNumber {
    const square = {
        r: z.r * z.r - z.i * z.i,
        i: 2 * z.r * z.i,
    };
    return square;
}

function complex_magnitude(z: ComplexNumber): number {
    const magnitude = Math.sqrt(z.r * z.r + z.i * z.i);
    return magnitude;
}

export function julia_for(c: ComplexNumber): (x: number, y: number) => number {
    const iterations = 10;

    return (x, y) => {
        function iterate(z: ComplexNumber): ComplexNumber {
            const z_square = complex_square(z);
            const next = complex_add(z_square, c);
            return next;
        }

        let z = {r: x, i: y};
        for (let i = 0; i < iterations; i++) {
            z = iterate(z);
        }

        return complex_magnitude(z);
    };
}

export function scaled_julia_for(c: ComplexNumber, scale: number): ReturnType<typeof julia_for> {
    const julia = julia_for(c);

    return (x, y) => {
        x /= scale;
        y /= scale;
        return julia(x, y);
    }
}
