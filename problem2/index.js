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
  files.sort()
  folders.sort((f1, f2) => f1.name.localeCompare(f2.name))
  return { files, folders }
}

module.exports = function fileSearch(fileToSearch, filesObj) {
  // assumption: filesObj is a valid JSON file and the root node is a folder
  const tree = JSON.parse(filesObj)
  const root = { name: '', ...readFolder(tree) }
  console.log(JSON.stringify(root, null, 2))
}
