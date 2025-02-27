function getCenterElementInArray(array) {
  for (let i = 0; i <= array.length - 9; i++) {
    const formedWord = array.slice(i, i + 9);
    console.log("formedWord", formedWord);
    const hasXXX =
      formedWord[0] == formedWord[1] && formedWord[1] == formedWord[2];
    const hasYYY =
      formedWord[6] == formedWord[7] && formedWord[6] == formedWord[8];

    if (hasXXX && hasYYY) {
      console.log("result", formedWord.slice(3, 6));
    }
  }
}

module.exports = getCenterElementInArray;
