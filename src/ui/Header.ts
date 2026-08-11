import LogoImg from '../assets/logo.png';

export class Header {
    public header: HTMLDivElement;
    public logo: HTMLImageElement;

    constructor() {
        this.header = document.createElement('div');
        this.header.classList.add('header');

        this.logo = document.createElement('img');
        this.logo.src = LogoImg;
        this.logo.classList.add('logo');

        const content = document.createElement('div');
        content.classList.add('content');
        
        content.appendChild(this.logo);

        this.header.appendChild(content);
    }

    // add(child: HTMLElement) {

    // }
}