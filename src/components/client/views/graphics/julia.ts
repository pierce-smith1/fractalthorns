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

function complex_mult(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
    const product = {
        r: a.r * b.r - a.i * b.i,
        i: a.r * b.i + a.i * b.r,
    };
    return product;
}

function complex_pow(z: ComplexNumber, p: number) {
    let result = z;

    for (let i = 0; i < p - 1; i++) {
        result = complex_mult(result, z);
    }

    return result;
}

function complex_magnitude(z: ComplexNumber): number {
    const magnitude = Math.sqrt(z.r * z.r + z.i * z.i);
    return magnitude;
}

export function julia_for(c: ComplexNumber, iterations: number): (x: number, y: number) => number {
    return (x, y) => {
        function iterate(z: ComplexNumber): ComplexNumber {
            const z_square = complex_pow(z, 4);
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

export function scaled_julia_for(c: ComplexNumber, iterations: number, scale: number): ReturnType<typeof julia_for> {
    const julia = julia_for(c, iterations);

    return (x, y) => {
        x /= scale;
        y /= scale;
        return julia(x, y);
    }
}
