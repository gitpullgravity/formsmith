module.exports = function append(element, string) {
  let tempContainer = document.createElement('div');
  tempContainer.innerHTML = string.trim();
  let realElement = tempContainer.firstChild;
  element.appendChild(realElement);
  return realElement;
}