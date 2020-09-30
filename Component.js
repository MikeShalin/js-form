export class Component {
  constructor({ parent, tagName, body, attrType, value, className, placeholder, disabled }) {
    this.parent = parent;
    this.tagName = tagName;
    this.body = body;
    this.type = attrType;
    this.value = value;
    this.className = className;
    this.placeholder = placeholder;
    this.disabled = disabled;
  }
  
  init(child) {
    this.component = document.createElement(this.tagName);
    if(this.parent) {
      this.parent.append(this.component);
    }
    if(child) {
      child.forEach((component) => {
        this.component.append(component);
      });
    }
    if(typeof this.body === 'string') {
      this.component.innerHTML = this.body;
    }
    if(typeof this.type === 'string') {
      this.component.type = this.type;
    }
    if(typeof this.value === 'string') {
      this.component.value = this.value;
    }
    if(Array.isArray(this.className)) {
      this.className.forEach(className => {
        this.component.classList.add(className);
      });
    }
    if(typeof this.className === 'string') {
      this.component.classList.add(this.className);
    }
    if(typeof this.placeholder === 'string') {
      this.component.placeholder = this.placeholder;
    }
    if(this.disabled) {
      this.component.disabled = this.disabled;
    }
  }
  
  addEvent(event, callback) {
    this.component.addEventListener(event, callback);
    return this.component.value;
  }
  
  get current() {
    return this.component;
  }
  
  appendChild(children) {
    this.component.innerHTML = '';
    children.forEach((component) => {
      this.component.append(component);
    });
  }
  
  toggleClassNames(action, className) {
    if(action === 'add') {
      this.component.classList.add(className);
    }
    if(action === 'remove') {
      this.component.classList.remove(className);
    }
  }
}