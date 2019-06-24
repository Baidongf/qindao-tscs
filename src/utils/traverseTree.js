
export function findChildById (node, id) {
  let result = null;
  function find(node, id) {
    if (node.id === id) {
      result = node
    }
    if (result) {
      return
    }
    let children = node.children || []
    children.forEach(function (item) {
      find(item, id)
    })
  }
  find(node, id)
  return result
}
