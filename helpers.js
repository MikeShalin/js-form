import {
  MOBILE_MASK,
  MOBILE_PATTERN,
  MOBILE_STRING_PATTERN,
} from './constants';

export const searchStringFilter = (item, filterStr) => {
  if(filterStr === '') return -1;
  return item.toLowerCase().indexOf(filterStr.toLowerCase());
};

export const ListRender = (listItems, callback) => (
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

export const checkValidate = (nameValue, telValue) => !nameValue || !MOBILE_PATTERN.exec(telValue);
export const addTelMask = (value) => value.replace(MOBILE_MASK, MOBILE_STRING_PATTERN);
