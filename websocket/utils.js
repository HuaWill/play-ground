let createElement = (tagName, data, children) => {
  let tag = document.createElement(tagName);
  const {attrs} = data;

  for (let attrName in attrs) {
    tag.setAttribute(attrName, attrs[attrName]);
  }

  if (Object.prototype.toString.call(children) !== '[object Array]') {
    let child = document.createTextNode(children);
    tag.appendChild(child);
  } else {
    children.forEach(child => tag.appendChild(child));
  }

  return tag;
}

window.createElement = createElement;
