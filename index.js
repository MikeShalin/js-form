import 'regenerator-runtime/runtime'

const STORAGE_NAME = 'form';
const MOBILE_PATTERN = /^\+?[789]\d{9,10}$/;

(function () {
  class Component {
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
      this.component = document.createElement(this.tagName)
      if(this.parent) {
        this.parent.append(this.component);
      }
      if(child) {
        child.forEach((component) => {
          this.component.append(component);
        })
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
        })
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
      return this.component
    }
    
    appendChild(children) {
      this.component.innerHTML = '';
      children.forEach((component) => {
        this.component.append(component);
      })
    }
  }
  
  const searchStringFilter = (item, filterStr) => {
    if(filterStr === '') return -1;
    return item.toLowerCase().indexOf(filterStr.toLowerCase());
  };
  
  const ListRender = (listItems, callback) => (
    listItems.map((friend => {
      const Friend = new Component({ tagName: 'li', body: friend, className: 'friend' });
      Friend.init();
      if(callback) {
        Friend.addEvent('click', () => callback(friend));
      }
      return Friend.current;
    }))
  );
  
  const main = document.getElementById('root');
  
  const apiCall = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('fetching error', error)
    }
  }
  
  async function start() {
    const apiMale = await apiCall('http://localhost:3000/male')
    const apiFemale = await apiCall('http://localhost:3000/female')
    let name = '';
    let tel = '';
    if(localStorage.getItem(STORAGE_NAME)) {
      [name, tel] = Object.entries(JSON.parse(localStorage.getItem(STORAGE_NAME)))[0];
    }
    
    const Wrapper = new Component({
      parent: main,
      tagName: 'div',
      className: 'wrapper',
    });
    
    Wrapper.init();
    
    const NameBox = new Component({
      parent: Wrapper.current,
      tagName: 'div',
      className: 'NameBox',
    });
  
    NameBox.init();
  
    const InputName = new Component({
      parent: NameBox.current,
      tagName: 'input',
      value: name,
      className: 'input',
      placeholder: 'Name',
    });
    
    const InputTel = new Component({
      parent: Wrapper.current,
      tagName: 'input',
      attrType: 'tel',
      value: tel,
      className: 'input',
      placeholder: 'Mobile',
    });
  
  
    const List = new Component({ parent: NameBox.current, tagName: 'ul', className: ['list', 'hide'] });
    
    const SubmitBtn = new Component({
      parent: Wrapper.current,
      tagName: 'button',
      attrType: 'submit',
      body: 'Submit',
      className: 'btn',
      disabled: true,
    });
    
    const ResetBtn = new Component({
      parent: Wrapper.current,
      tagName: 'button',
      attrType: 'button',
      body: 'Reset',
      className: 'btn',
    });
    
    const data = await Promise.all([...apiMale, ...apiFemale]);
    
    const proxyData = {
      data,
      get friends() {
        return this.data
      },
      
      set filterFriends(friends) {
        this.data = friends
      },
    };
    
    InputName.init();
    InputTel.init();
    SubmitBtn.init();
    ResetBtn.init();
    
    InputName.addEvent('keyup', ({ target }) => {
      InputName.current.setAttribute('value', target.value);
    });
    
    InputTel.addEvent('keyup', ({ target }) => {
      InputTel.current.setAttribute('value', target.value);
    });
    
    SubmitBtn.addEvent('click', ({ target }) => {
      localStorage.setItem(STORAGE_NAME, JSON.stringify({
        [InputName.current.value]: InputTel.current.value,
      }));
      InputName.current.value = '';
      InputTel.current.value = '';
    });
    
    ResetBtn.addEvent('click', ({ target }) => {
      InputName.current.value = '';
      InputTel.current.value = '';
      localStorage.removeItem(STORAGE_NAME);
    });
    
    
    const observerInputName = new MutationObserver(() => {
      const onFilter = (friends, stringFilter) => friends.filter((friend => searchStringFilter(String(friend), String(stringFilter)) === 0));
      const friendFiltered = onFilter(proxyData.friends, InputName.current.value);
      List.appendChild(ListRender(friendFiltered, (clickedItem) => {
        InputName.current.value = clickedItem;
        List.current.classList.add('hide')
      }));
      
      if (!InputName.current.value || !friendFiltered.length) {
        List.current.classList.add('hide')
      } else {
        List.current.classList.remove('hide')
      }
      
      // SubmitBtn.current.disabled = !!InputName.current.value; todo check it
    });
    
    const observerInputTel = new MutationObserver(() => {
      SubmitBtn.current.disabled = !MOBILE_PATTERN.exec(InputTel.current.value);
    });
    
    observerInputName.observe(InputName.current, { attributes: true });
    observerInputTel.observe(InputTel.current, { attributes: true });
    
    List.init();
  }
  
  document.addEventListener('DOMContentLoaded', start);
}());