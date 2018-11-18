import { keyCode } from './utils';

const linkContacts = document.querySelector('.contacts__button');
const linkMap = document.querySelector('.contacts__map');
const popupWriteUs = document.querySelector('.write-us');
const popupMap = document.querySelector('.map');

const closePopupWriteUs = popupWriteUs.querySelector('.button--close');
const closePopupMap = popupMap.querySelector('.button--close');

const formWriteUs = document.forms[1];

const nameUser = formWriteUs.querySelector('[name=name]');
const emailUser = formWriteUs.querySelector('[name=email]');
const messageUser = formWriteUs.querySelector('[name=message]');

let isStorageSupport = true;
let storage = '';

function supportPreventDefault(event) {
  return event.preventDefault
    ? event.preventDefault()
    : (event.returnValue = false);
}

try {
  storage = localStorage.getItem('nameUser');
} catch (err) {
  isStorageSupport = false;
}

linkContacts.addEventListener('click', event => {
  supportPreventDefault(event);
  popupWriteUs.classList.add('modal--show');
  nameUser.focus();

  if (storage) {
    nameUser.value = storage;
    emailUser.focus();
  } else {
    nameUser.focus();
  }
});

formWriteUs.addEventListener('submit', event => {
  if (!nameUser.value || !emailUser.value || !messageUser.value) {
    supportPreventDefault(event);
    popupWriteUs.classList.remove('modal--error');
    popupWriteUs.classList.add('modal--error');
  } else if (isStorageSupport) {
    localStorage.setItem('nameUser', nameUser.value);
  }
});

closePopupWriteUs.addEventListener('click', event => {
  supportPreventDefault(event);
  popupWriteUs.classList.remove('modal--show', 'modal--error');
});

linkMap.addEventListener('click', event => {
  supportPreventDefault(event);
  popupMap.classList.add('modal--show');
});

window.addEventListener('keydown', event => {
  if (event.keyCode === keyCode.ESC) {
    supportPreventDefault(event);

    if (popupWriteUs.classList.contains('modal--show')) {
      popupWriteUs.classList.remove('modal--show', 'modal--error');
    }

    if (popupMap.classList.contains('modal--show')) {
      popupMap.classList.remove('modal--show');
    }
  }
});

closePopupMap.addEventListener('click', event => {
  supportPreventDefault(event);
  popupMap.classList.remove('modal--show');
});
