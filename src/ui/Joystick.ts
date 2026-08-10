import * as THREE from 'three';

export class Joystick {
    private base!: HTMLDivElement;
    private knob!: HTMLDivElement;

    private centerX = 0;
    private centerY = 0;

    private radius = 60;

    public direction = new THREE.Vector2();

    public active = false;

    constructor(
        private element: HTMLElement,
    ) {
        element.addEventListener(
            'pointerdown',
            this.onPointerDown,
        );

        element.addEventListener(
            'pointermove',
            this.onPointerMove,
        );

        element.addEventListener(
            'pointerup',
            this.onPointerUp,
        );

        // element.addEventListener(
        //     'pointercancel',
        //     this.onPointerCancel,
        // );
    }

    private onPointerDown = (event: PointerEvent) => {
        if (this.active) return;

        this.active = true;

        this.centerX = event.clientX;
        this.centerY = event.clientY;

        this.createJoystick();
    }

    private onPointerMove = (event: PointerEvent) => {
        if (!this.active) return;

        let dx = event.clientX - this.centerX;
        let dy = this.centerY - event.clientY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.radius) {
            dx = dx / distance * this.radius;
            dy = dy / distance * this.radius;
        }

        this.knob.style.left = `${this.radius + dx}px`;
        this.knob.style.top = `${this.radius - dy}px`;

        this.direction.set(dx / this.radius, dy / this.radius);

        if (this.direction.length() > 1) {
            this.direction.normalize();
        }
    }

    private onPointerUp = () => {
        this.active = false;

        this.direction.set(0, 0);

        this.base.remove();
    }

    private createJoystick() {
        this.base = document.createElement('div');
        this.knob = document.createElement('div');

        this.base.classList.add('joystick');
        this.knob.classList.add('joystick-knob');

        this.base.appendChild(this.knob);

        this.base.style.left = `${this.centerX - this.radius}px`;
        this.base.style.top = `${this.centerY - this.radius}px`;

        this.knob.style.left = `${this.radius}px`
        this.knob.style.top = `${this.radius}px`

        document.body.appendChild(this.base);
    }
}