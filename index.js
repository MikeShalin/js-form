import 'regenerator-runtime/runtime';
import {
  STORAGE_NAME,
  MOBILE_MASK_NORMALIZED,
  MOBILE_PATTERN,
} from './constants';
import {
  searchStringFilter,
  checkValidate,
  addTelMask,
  apiCall
} from './helpers';
import { Component } from './Component';

(function () {
  const main = document.getElementById('root');
  
  async function start() {
    const apiMale = await apiCall('http://localhost:3000/male');
    const apiFemale = await apiCall('http://localhost:3000/female');
    
    let name = '';
    let tel = '';
    
    if(localStorage.getItem(STORAGE_NAME)) {
      [name, tel] = Object.entries(JSON.parse(localStorage.getItem(STORAGE_NAME)))[0];
    }
    
    const Form = new Component({
      parent: main,
      tagName: 'form',
      className: 'wrapper',
    });
    
    Form.init();
    
    const NameBox = new Component({
      parent: Form.current,
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
      parent: Form.current,
      tagName: 'input',
      attrType: 'tel',
      value: addTelMask(tel),
      className: 'input',
      placeholder: 'Mobile',
    });
    
    const List = new Component({
      parent: NameBox.current,
      tagName: 'ul',
      className: ['list', 'hide'],
    });
    
    const ResetBtn = new Component({
      parent: Form.current,
      tagName: 'button',
      attrType: 'button',
      body: 'Reset',
      className: 'btn',
    });
    
    const data = await Promise.all([...apiMale, ...apiFemale]);
    
    const proxyData = {
      data,
      get friends() {
        return this.data;
      },
      
      set filterFriends(friends) {
        this.data = friends;
      },
    };
    
    InputName.init();
    InputTel.init();
    
    const SubmitBtn = new Component({
      parent: Form.current,
      tagName: 'button',
      attrType: 'submit',
      body: 'Submit',
      className: 'btn',
      disabled: checkValidate(InputName.current.value, InputTel.current.value),
    });
    
    SubmitBtn.init();
    ResetBtn.init();
    
    const handleSubmit = (e) => {
      e.preventDefault();
      localStorage.setItem(STORAGE_NAME, JSON.stringify({
        [InputName.current.value]: InputTel.current.value.replace(MOBILE_MASK_NORMALIZED, ''),
      }));
      
      InputName.current.value = '';
      InputTel.current.value = '';
    };
    
    InputName.addEvent('keyup', ({ target }) => {
      InputName.current.setAttribute('value', target.value);
      InputName.toggleClassNames(target.value ? 'remove' : 'add', 'error')
    });
    
    InputTel.addEvent('keyup', ({ target }) => {
      target.value = addTelMask(target.value);
      InputTel.current.setAttribute('value', target.value);
      InputTel.toggleClassNames(MOBILE_PATTERN.exec(target.value) ? 'remove' : 'add', 'error')
    });
    
    SubmitBtn.addEvent('click', handleSubmit);
    Form.addEvent('submit', handleSubmit);
    
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
        List.current.classList.add('hide');
      }));
      
      if(!InputName.current.value || !friendFiltered.length) {
        List.current.classList.add('hide');
      } else {
        List.current.classList.remove('hide');
      }
      
      SubmitBtn.current.disabled = checkValidate(InputName.current.value, InputTel.current.value);
    });
    
    const observerInputTel = new MutationObserver(() => {
      SubmitBtn.current.disabled = checkValidate(InputName.current.value, InputTel.current.value);
    });
    
    observerInputName.observe(InputName.current, { attributes: true });
    observerInputTel.observe(InputTel.current, { attributes: true });
  
    const ListRender = (listItems, callback) => (
      listItems.map((friend => {
        const Friend = new Component({
          tagName: 'li',
          body: friend,
          className: 'friend',
        });
      
        Friend.init();
      
        if(callback) {
          Friend.addEvent('click', () => callback(friend));
        }
      
        return Friend.current;
      }))
    );
    List.init();
  }
  
  document.addEventListener('DOMContentLoaded', start);
}());