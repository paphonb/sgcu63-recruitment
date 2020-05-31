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

function search(name, folder) {
  // search for direct childs of this folder first
  const results = folder.files
    .filter(file => file === name)
    .map(file => `/${file}`)
  // then search subfolders
  for (let subfolder of folder.folders) {
    search(name, subfolder).forEach(result => {
      results.push(`/${subfolder.name}${result}`)
    })
  }
  // results will already be in the correct order
  // so we don't have to sort it again
  return results
}

module.exports = function fileSearch(fileToSearch, filesObj) {
  // assumption: filesObj is a valid JSON file and the root node is a folder
  const tree = JSON.parse(filesObj)
  const root = { name: '', ...readFolder(tree) }
  return search(fileToSearch, root)
}
