
"use strict";
var expect = chai.expect;
function sum(x, y) {
    return x + y;
}
let globalSum = 0;

function initializePrompt() {
    // let input = 0;
    // while (true) {
    //     input = window.prompt("Podaj dane:");
    //     if (input == null) {
    //         break;
    //     }
    //     console.log(
    //         "%o%o%i",
    //         JSON.stringify(cyfry(input)),
    //         JSON.stringify(litery(input)),
    //         suma(input)
    //     );
    // }
}

function cyfry(napis) {
    let oddSum = 0;
    let evenSum = 0;
    for (const char of napis) {
        const charToInt = parseInt(char);
        if (!isNaN(charToInt)) {
            if (charToInt % 2 == 0) {
                evenSum += charToInt;
            } else {
                oddSum += charToInt;
            }
        }
    }
    return [oddSum, evenSum];
}

function litery(napis) {
    let lowercaseCounter = 0;
    let uppercaseCounter = 0;
    for (const char of napis) {
        // sprawdzamy czy char jest literą a nie cyfrą
        if (char.toLowerCase() != char.toUpperCase()) {
            if (char.toLowerCase() == char) {
                lowercaseCounter += 1;
            } else {
                uppercaseCounter += 1;
            }
        }
    }
    return [lowercaseCounter, uppercaseCounter];
}

function suma(napis) {
    let endOfNumberIdx = -1;
    for (const char of napis) {
        if (isNaN(parseInt(char))) {
            break;
        }
        endOfNumberIdx += 1;
    }

    if (endOfNumberIdx != -1) {
        globalSum += parseInt(napis.substr(0, endOfNumberIdx + 1));
    }
    return globalSum;
}

describe('The sum() function', function () {
    it('Returns 4 for 2+2', function () {
        expect(sum(2, 2)).to.equal(4);
    });
    it('Returns 0 for -2+2', function () {
        expect(sum(-2, 2)).to.equal(0);
    });
});

describe('The cyfry() function', function () {
    it('Returns [7, 6] for "472"', function () {
        expect(cyfry("472")).deep.to.equal([7, 6]);
    });
    it('Returns [0, 0] for "abc"', function () {
        expect(cyfry("abc")).deep.to.equal([0, 0]);
    });
    it('Returns [4, 2] for "abc123"', function () {
        expect(cyfry("abc123")).deep.to.equal([4, 2]);
    });
    it('Returns [4, 2] for "123abc"', function () {
        expect(cyfry("123abc")).deep.to.equal([4, 2]);
    });
    it('Returns [0, 0] for ""', function () {
        expect(cyfry("")).deep.to.equal([0, 0]);
    });
});

describe('The litery() function', function () {
    it('Returns [0, 0] for "472"', function () {
        expect(litery("472")).deep.to.equal([0, 0]);
    });
    it('Returns [2, 1] for "aBc"', function () {
        expect(litery("aBc")).deep.to.equal([2, 1]);
    });
    it('Returns [1, 2] for "AbC123"', function () {
        expect(litery("AbC123")).deep.to.equal([1, 2]);
    });
    it('Returns [3, 0] for "123abc"', function () {
        expect(litery("123abc")).deep.to.equal([3, 0]);
    });
    it('Returns [0, 0] for ""', function () {
        expect(litery("")).deep.to.equal([0, 0]);
    });
});

describe('The suma() function', function () {
    it('Returns 472 for "472"', function () {
        expect(suma("472")).to.equal(472);
    });
    it('Returns 472 for "aBc"', function () {
        expect(suma("aBc")).to.equal(472);
    });
    it('Returns 472 for "AbC123"', function () {
        expect(suma("AbC123")).to.equal(472);
    });
    it('Returns 595 for "123abc"', function () {
        expect(suma("123abc")).to.equal(595);
    });
    it('Returns 595 for ""', function () {
        expect(suma("")).to.equal(595);
    });
});