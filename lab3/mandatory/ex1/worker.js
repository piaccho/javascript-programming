function calculatePrimes(iterations) {
    // Source: https://udn.realityripple.com/docs/Tools/Performance/Scenarios/Intensive_JavaScript
    var primes = [];
    for (var i = 0; i < iterations; i++) {
        var candidate = i * (1000000000 * Math.random());
        var isPrime = true;
        for (var c = 2; c <= Math.sqrt(candidate); ++c) {
        if (candidate % c === 0) {
            // not prime
            isPrime = false;
            break;
        }
        }
        if (isPrime) {
        primes.push(candidate);
        }
    }
    return primes;
}

// obsluga zdarzenia 'message' wyslanego z watku glownego
onmessage = (e) => {
    switch(e.data) {
        case 'start':
            this.postMessage('watek uruchomiony!');
            break;
        case 'stop':
            this.postMessage('watek zatrzymany!');
            this.close(); // zatrzymanie skryptu wewnatrz watku roboczego
            break;
        default:
            const iterations = Number.parseInt(e.data)   
            if (Number.isInteger(iterations)) {
                this.postMessage(calculatePrimes(iterations));
            } else {
                this.postMessage("błędna wartość");
            }
    }
};