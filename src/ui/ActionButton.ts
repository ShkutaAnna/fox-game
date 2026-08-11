import ButtonImg from '../assets/green-button.png';

export class ActionButton {
    public button: HTMLButtonElement;

    constructor () {
        this.button = document.createElement('button');
        this.button.classList.add('action-button');

        const img = document.createElement('img');
        img.src = ButtonImg;

        const text = document.createElement('span');
        text.innerText = 'Look around';

        this.button.append(img, text);
    }
}