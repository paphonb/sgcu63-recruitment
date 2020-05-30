const font = require('./font')

module.exports = function numericalization(number, vertCount, horzCount) {
  for (let y = 0; y < 5; y++) {
    for (let num of number) {
      for (let x = 0; x < 5; x++) {
        process.stdout.write(font[num][y][x])
      }
      process.stdout.write(' ')
    }
    process.stdout.write('\n')
  }
}
