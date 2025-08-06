type ComplexNumber = {
    r: number,
    i: number,
};

function complex_add(a: ComplexNumber, b: ComplexNumber, out: ComplexNumber): void {
    const new_r = a.r + b.r;
    const new_i = a.i + b.i;
    out.r = new_r;
    out.i = new_i;
}

function complex_sub(a: ComplexNumber, b: ComplexNumber, out: ComplexNumber): void {
    const new_r = a.r - b.r;
    const new_i = a.i - b.i;
    out.r = new_r;
    out.i = new_i;
}

function complex_mult(a: ComplexNumber, b: ComplexNumber, out: ComplexNumber): void {
    const new_r = a.r * b.r - a.i * b.i;
    const new_i = a.r * b.i + a.i * b.r;
    out.r = new_r;
    out.i = new_i;
}

function complex_pow(z: ComplexNumber, p: number, out: ComplexNumber): void {
    for (let i = 0; i < p; i++) {
        complex_mult(z, z, out);
    }
}

export function complex_magnitude(z: ComplexNumber): number {
    const magnitude = Math.sqrt(z.r * z.r + z.i * z.i);
    return magnitude;
}

// Scratch object to avoid allocating memory for temporaries
let z1 = {r: 0, i: 0};
export function julia_for(c: ComplexNumber, iterations: number): (x: number, y: number) => ComplexNumber {
    return (x, y) => {
        function iterate(z: ComplexNumber): void {
            complex_pow(z, 4, z1);
            complex_pow(z, 2, z);
            complex_sub(z1, z, z);
            complex_add(z, c, z);
        }

        let z = {r: x, i: y};
        for (let i = 0; i < iterations; i++) {
            iterate(z);
        }

        return z;
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
