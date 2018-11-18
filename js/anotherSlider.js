import { keyCode } from './utils';

class AnotherSlider {
  constructor() {
    this.init();
  }

  init() {
    this.slider = document.querySelector('.another-slider--js');

    this.sliderInputArray = Array.from(
      this.slider.querySelectorAll('.button--js')
    );

    this.sliderItemArray = this.slider.querySelectorAll('.features__item--js');

    this.obj = {};
    this.objLabel = {};

    this.sliderInputArray.forEach((label, i) => {
      let curTargetClassVal = label.classList.value;
      this.obj[curTargetClassVal] = this.sliderItemArray[i];
      this.objLabel[curTargetClassVal] = this.sliderInputArray[i];
    });

    this.sliderList = this.slider.querySelector('.tabs__list--js');
    this.sliderInputArray[0].classList.add('button--active');
    this.sliderInputArray[0].parentNode.classList.add('tabs__item--active');

    this.sliderList.addEventListener('click', evt => {
      let targetClasslistValue = evt.target.classList.value;
      if (
        this.obj[targetClasslistValue] &&
        this.objLabel[targetClasslistValue]
      ) {
        this.removeActiveClass();
        this.obj[targetClasslistValue].classList.add('features__item--active');
        this.objLabel[targetClasslistValue].classList.add('button--active');
        this.objLabel[targetClasslistValue].parentNode.classList.add(
          'tabs__item--active'
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
        this.obj[targetClasslistValue].classList.add('features__item--active');
        this.objLabel[targetClasslistValue].classList.add('button--active');
        this.objLabel[targetClasslistValue].parentNode.classList.add(
          'tabs__item--active'
        );
      }
    });
  }

  removeActiveClass() {
    for (let i of this.sliderItemArray) {
      i.classList.remove('features__item--active');
    }
    for (let i of this.sliderInputArray) {
      i.classList.remove('button--active');
      i.parentNode.classList.remove('tabs__item--active');
    }
  }
}

export default new AnotherSlider();
