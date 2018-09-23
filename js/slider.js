import { keyCode } from './utils';

class Slider {
  constructor() {
    this.init();
  }

  init() {
    this.slider = document.querySelector('.slider');

    this.sliderInputArray = Array.from(
      this.slider.querySelectorAll('.slide-navigation__label')
    );

    this.sliderItemArray = this.slider.querySelectorAll('.slider__item');

    this.obj = {};
    this.objLabel = {};

    this.sliderInputArray.forEach((label, i) => {
      let curTargetClassVal = label.classList.value;
      this.obj[curTargetClassVal] = this.sliderItemArray[i];
      this.objLabel[curTargetClassVal] = this.sliderInputArray[i];
    });

    this.sliderList = this.slider.querySelector('.slide-navigation__list');
    this.sliderInputArray[0].classList.add('slide-navigation__label--active');

    this.sliderList.addEventListener('click', evt => {
      let targetClasslistValue = evt.target.classList.value;
      if (
        this.obj[targetClasslistValue] &&
        this.objLabel[targetClasslistValue]
      ) {
        this.removeActiveClass();
        this.obj[targetClasslistValue].classList.add('slider__item--active');
        this.objLabel[targetClasslistValue].classList.add(
          'slide-navigation__label--active'
        );
      }
    });

    this.sliderList.addEventListener('keydown', evt => {
      let targetClasslistValue = evt.target.classList.value;
      const isEnterPressed = evt.keyCode === keyCode.ENTER;
      if (
        this.obj[targetClasslistValue] &&
        isEnterPressed &&
        this.objLabel[targetClasslistValue]
      ) {
        this.removeActiveClass();
        this.obj[targetClasslistValue].classList.add('slider__item--active');
        this.objLabel[targetClasslistValue].classList.add(
          'slide-navigation__label--active'
        );
      }
    });
  }

  removeActiveClass() {
    for (let i of this.sliderItemArray) {
      i.classList.remove('slider__item--active');
    }
    for (let i of this.sliderInputArray) {
      i.classList.remove('slide-navigation__label--active');
    }
  }
}

export default new Slider();
