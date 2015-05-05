
// Takes an element, and sets its innerHTML, 
// returning the newly created child
module.exports = function insert(element, string) {
  let tempContainer = document.createElement('div');
  tempContainer.innerHTML = string.trim();
  let realElement = tempContainer.firstChild;
  element.appendChild(realElement);
  return realElement;
}