const font = require('./font')

// function to write a char for n times to magnify horizontally
function write(char, times) {
  while (times--) {
    process.stdout.write(char)
  }
}

module.exports = function numericalization(number, vertCount, horzCount) {
  for (let y = 0; y < 5; y++) {
    // magnify vertically
    for (let subY = 0; subY < vertCount; subY++) {
      let isFirst = true
      for (let num of number) {
        // print the spacer
        if (isFirst) {
          isFirst = false
        } else {
          write(' ', horzCount)
        }
        
        // then print the numbers
        for (let x = 0; x < 5; x++) {
          write(font[num][y][x], horzCount)
        }
      }
      process.stdout.write('\n')
    }
  }
}
