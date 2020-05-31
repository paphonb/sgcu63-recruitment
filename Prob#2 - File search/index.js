function readFolder(folder) {
  // assumption: _files is an array of strings
  //             and other properties are valid folders
  const files = folder._files || []
  const folders = Object.keys(folder)
    .filter(name => name != '_files')
    .map(name => ({
      name, ...readFolder(folder[name]),
    }))
  // sort the children
  folders.sort((f1, f2) => f1.name.localeCompare(f2.name))
  return { files, folders }
}

module.exports = function fileSearch(fileToSearch, filesObj) {
  // assumption: filesObj is a valid JSON file and the root node is a folder
  const tree = JSON.parse(filesObj)
  const root = { name: '', ...readFolder(tree) }

  // using a bfs algorithm ensures that more shallow nodes always get visited first
  // for equally deep nodes, sorting is already handled while parsing the tree
  const results = []
  const queue = [{ parent: '', folder: root }]
  while (queue.length > 0) {
    const { parent, folder } = queue.shift()
    for (const file of folder.files) {
      if (file === fileToSearch) {
        results.push(`${parent}${folder.name}/${file}`)
      }
    }
    for (const subFolder of folder.folders) {
      queue.push({ parent: `${parent}${folder.name}/`, folder: subFolder })
    }
  }
  return results
}
