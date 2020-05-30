const numericalization = require('./numericalization')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const pattern = /[0-9]+/g

rl.on('line', input => {
  // assumption: the input is correctly formatted
  const matches = input.match(pattern)
  numericalization(matches[0], parseInt(matches[1]), parseInt(matches[2]))
  rl.close()
})
