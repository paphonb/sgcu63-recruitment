const fileSearch = require('.')

const jsonString = JSON.stringify({
  A: {
    _files: ['file1', 'file2'],
    C: {
      _files: ['file1'],
      F: {
        _files: ['file1']
      }
    },
    G: {
      _files: ['file1']
    }
  },
  B: {
    _files: ['file1']
  },
  D: {
    _files: ['file1'],
    E: {
      _files: ['file1']
    }
  },
  d: {
    _files: ['file1']
  },
  _files: ['file1']
})

function depth(path) {
  return path.split('/').length
}

function compare(first, second) {
  const depthCompare = depth(first) - depth(second)
  if (depthCompare != 0) {
    return depthCompare
  }
  return first.localeCompare(second)
}

function test(fileToSearch, filesObj) {
  const results = fileSearch(fileToSearch, filesObj)
  console.log(results)
  for (let i = 0; i < results.length - 1; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const first = results[i]
      const second = results[j]
      if (compare(first, second) > 0) {
        console.log(`invalid order: ${first}, ${second}`)
      }
    }
  }
}

test('file1', jsonString)
