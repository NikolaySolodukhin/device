import { keyCode } from './utils';

class Slider {
  constructor() {
    this.init();
  }

  init() {
    this.slider = document.querySelector('.slider');

    this.sliderInputArray = this.slider.querySelectorAll(
      '.slide-navigation__label'
    );

    this.sliderItemArray = this.slider.querySelectorAll('.slider__item');

    this.obj = {};

    for (let i = 0; i < this.sliderInputArray.length; i++) {
      this.obj[this.sliderInputArray[i].classList.value] = this.sliderItemArray[
        i
      ];
    }

    this.objValues = Object.values(this.obj);

    this.sliderList = this.slider.querySelector('.slide-navigation__list');

    this.sliderList.addEventListener('click', evt => {
      let targetClasslistValue = evt.target.classList.value;
      if (this.obj[targetClasslistValue]) {
        this.removeActiveClass();
        this.obj[targetClasslistValue].classList.add('slider__item--active');
      }
    });

    this.sliderList.addEventListener('keydown', evt => {
      let targetClasslistValue = evt.target.classList.value;
      const isEnterPressed = evt.keyCode === keyCode.ENTER;
      if (this.obj[targetClasslistValue] && isEnterPressed) {
        this.removeActiveClass();
        this.obj[targetClasslistValue].classList.add('slider__item--active');
      }
    });
  }

  removeActiveClass() {
    for (let i of this.objValues) {
      i.classList.remove('slider__item--active');
    }
  }
}

export default new Slider();
