const crypto = require('crypto');


// convert Ed25519 key pair to a base64|base64 seed (todo: 12 seed word from ed25519 and ed25519 back-to seed word)
const keyPairTo12SeedWord = function keyPairTo12SeedWord(ed25519KeyPair) { // use https://github.com/dazoe/ed25519 to convert
  // donkeyballs
  const publicKeyBase64 = ed25519KeyPair.publicKey.toString('base64');
  const privateKeyBase64 = ed25519KeyPair.privateKey.toString('base64');
  return `${publicKeyBase64}|${privateKeyBase64}`;
};



const scramble = function scramble(seedWords, azAZ09Pin) { // scramble a 12-word seed with an alphanumeric PIN
  if (!seedWords || !/^[a-zA-Z0-9]+(\|[a-zA-Z0-9]+)?$/.test(seedWords) || !/^[a-zA-Z0-9]+$/.test(azAZ09Pin)) { // Validate input
    throw new Error('Invalid input for scrambling.');
  }
  const pinArray = azAZ09Pin.split('').map(char => parseInt(char, 36)); // Convert PIN to an array of numbers
  const scrambledSeedWords = seedWords // Scramble seed words based on the PIN
    .split('|')
    .map((word, index) => {
      const pinIndex = index % pinArray.length;
      const newPosition = (index + pinArray[pinIndex]) % seedWords.length;
      return seedWords.split('|')[newPosition];
    })
    .join('|');
  return scrambledSeedWords;
};


const unscramble = function unscramble(scrambledSeedWords, azAZ09Pin) { // unscramble data with an alphanumeric PIN
  if (!scrambledSeedWords || !/^[a-zA-Z0-9]+(\|[a-zA-Z0-9]+)?$/.test(scrambledSeedWords) || !/^[a-zA-Z0-9]+$/.test(azAZ09Pin)) { // Validate input
    throw new Error('Invalid input for unscrambling.');
  }
  const pinArray = azAZ09Pin.split('').map(char => parseInt(char, 36)); // Convert PIN to an array of numbers
  const unscrambledSeedWords = scrambledSeedWords // Unscramble seed words based on the PIN
    .split('|')
    .map((word, index) => {
      const pinIndex = index % pinArray.length;
      const originalPosition = (index - pinArray[pinIndex] + scrambledSeedWords.length) % scrambledSeedWords.length;
      return scrambledSeedWords.split('|')[originalPosition];
    })
    .join('|');
  return unscrambledSeedWords;
};




// Example usage
const exampleSeedWords = 'abc123|def456'; // Replace with actual 12-word seed
const examplePin = '155Z0b';

// Scramble the seed words
const scrambledData = scramble(exampleSeedWords, examplePin);
console.log('Scrambled Data:', scrambledData);

// Unscramble the data
const unscrambledSeedWords = unscramble(scrambledData, examplePin);
console.log('Unscrambled Seed Words:', unscrambledSeedWords);




//
