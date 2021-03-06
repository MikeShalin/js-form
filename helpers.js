import {
  MOBILE_MASK,
  MOBILE_PATTERN,
  MOBILE_STRING_PATTERN,
} from './constants';

export const searchStringFilter = (item, filterStr) => {
  if(filterStr === '') return -1;
  return item.toLowerCase().indexOf(filterStr.toLowerCase());
};

export const checkValidate = (nameValue, telValue) => !nameValue || !MOBILE_PATTERN.exec(telValue);
export const addTelMask = (value) => value.replace(MOBILE_MASK, MOBILE_STRING_PATTERN);
export const apiCall = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('fetching error', error);
  }
};
