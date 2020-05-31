const font = require('./font')

// function to write a char for n times to magnify horizontally
function write(char, times) {
  while (times--) {
    process.stdout.write(char)
  }
}

function printLine(number, vertCount, horzCount) {
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

module.exports = function numericalization(number, vertCount, horzCount) {
  // additional idea: if the number doesn't fit in one line, display in 
  //                  in multiple lines separated by M1 newlines
  const width = process.stdout.columns || MAX_SAFE_INTEGER
  let maxLength = Math.floor((width + 1) / (horzCount * 6))
  if (maxLength === 0) {
    // it will overflow with 1 number anyway
    maxLength = MAX_SAFE_INTEGER
  }
  const lines = number.match(new RegExp(`.{1,${maxLength}}`, 'g'))
  let isFirst = true
  for (const line of lines) {
    if (isFirst) {
      isFirst = false
    } else {
      write('\n', vertCount)
    }
    printLine(line, vertCount, horzCount)
  }
}
