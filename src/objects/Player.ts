import * as THREE from 'three';
import { foxUrl, type GLTFLoaderManager } from '../core/GLTFLoaderManager';
import { foxFontUrl, type FontManager } from '../core/FontManager';
import { MessageManager } from './MessageManager';

export class Player {
    public group = new THREE.Group();
    private mixer!: THREE.AnimationMixer;
    public actions: FoxActions = {
        [FoxAnimations.Survey]: null,
        [FoxAnimations.Walk]: null,
        [FoxAnimations.Run]: null,
    };

    private surveyProgressionStep = 0;
    private isSurveying = false;
    private surveyFinishedCallback?: () => void

    private surveyProgressionPhrases = [
        'I think i see something...',
        'Should probably check this out...'
    ];

    private isWalking = false;

    private messageManager!: MessageManager;

    public readonly walkSpeed = 3;
    public readonly runSpeed = 8;

    constructor(
        public loaderManager: GLTFLoaderManager,
        public fontManager: FontManager,
        public camera: THREE.Camera,
    ) {
        // const ax = new THREE.AxesHelper();
        // this.group.add(ax);
    }

    async load(): Promise<void> {
        const font = this.fontManager.load('foxFont', foxFontUrl);
        const model = new Promise<THREE.Group>((resolve, reject) => {
            this.loaderManager.loader.load(
                foxUrl,
                (gltf) => {
                    const fox = gltf.scene;
                    fox.scale.setScalar(0.015);
                    
                    this.mixer = new THREE.AnimationMixer(gltf.scene);
                    this.mixer.addEventListener('finished', (event) => this.handleAnimationFinished(event));
                    gltf.animations.forEach((animation) => {
                        if (!animation) return;

                        this.actions[animation.name as FoxAnimations] = this.mixer.clipAction(animation);
                    });

                    resolve(fox);
                },
                undefined,
                reject
            );
        });

        return Promise.all([font, model]).then((values) => {
            this.group.add(values[1]);
            this.messageManager = new MessageManager(values[0], this.group, this.camera);
        });
    }

    public update(dt: number) {
        this.mixer?.update(dt);
        this.messageManager?.update(dt);

        if (this.isSurveying) {
            const action = this.actions[FoxAnimations.Survey];

            if (action) {
                const progress = action.time / action.getClip().duration;

                if (Math.round(progress * 100) === 30 && this.surveyProgressionStep === 0) {
                    // 0. see something message; 1. i need to check; 3. put item in the scene, show it with the camera, go back to player, 3. draw path
                    // exec step 0
                    this.messageManager.addMessage(this.surveyProgressionPhrases[this.surveyProgressionStep]);
                    this.surveyProgressionStep = 1;
                }

                if (Math.round(progress * 100) === 80 && this.surveyProgressionStep === 1) {
                    // exec step 1
                    this.messageManager.addMessage(this.surveyProgressionPhrases[this.surveyProgressionStep]);
                    this.surveyProgressionStep = 2;
                }
            }
        }
    }

    public movePlayer(dir: THREE.Vector3, dt: number, speed: number) {
        if (!this.group) return;

        if (dir.lengthSq() > 0) {
            const movementDirection = new THREE.Vector3(-dir.x, dir.y, dir.z);
            this.group.position.addScaledVector(movementDirection, speed * dt);

            const targetAngle = Math.atan2(movementDirection.x, movementDirection.z);
            const currentAngle = this.group.rotation.y;
            const delta = THREE.MathUtils.euclideanModulo(
                targetAngle - currentAngle + Math.PI,
                Math.PI * 2
            ) - Math.PI;
            this.group.rotation.y = THREE.MathUtils.damp(currentAngle, currentAngle + delta, speed, dt);
        }
    }

    public canLookAround() {
        return !this.isSurveying;
    }

    public onLookAroundFinished(callback: () => void): void {
        this.surveyFinishedCallback = callback;
    }

    public lookAround() {
        const surveyAction = this.actions[FoxAnimations.Survey];
        if (surveyAction === null) return;

        this.isSurveying = true;
        surveyAction.reset();
        surveyAction.setLoop(THREE.LoopOnce, 1);
        surveyAction.clampWhenFinished = true;
        surveyAction.play();
    }

    public startMovingAnimation() {
        if (this.isWalking) return;

        const walkAction = this.actions[FoxAnimations.Walk];
        if (walkAction === null) return;

        this.isWalking = true;
        walkAction.reset();
        // walkAction.setLoop(THREE.LoopOnce, 1);
        walkAction.clampWhenFinished = true;
        walkAction.play();
    }

    public stopMovingAnimation(): void {
        if (!this.isWalking) return;

        const walkAction = this.actions[FoxAnimations.Walk];
        if (walkAction === null) return;

        walkAction.stop();
        this.isWalking = false;
    }

    private handleAnimationFinished(
        event: {
            action: THREE.AnimationAction;
            direction: number;
        } & THREE.Event<"finished", THREE.AnimationMixer<THREE.AnimationMixerEventMap>>,
    ) {
        if (event.action === this.actions[FoxAnimations.Survey]) {
            this.actions[FoxAnimations.Survey]?.fadeOut(0.4);

            setTimeout(() => {
                this.actions[FoxAnimations.Survey]?.stop();
                this.isSurveying = false;
                this.surveyProgressionStep = 0;
                // draw path to item 
                this.surveyFinishedCallback?.();
            }, 400);
        }

        // if (event.action === this.actions[FoxAnimations.Walk]) {
        //     this.actions[FoxAnimations.Walk]?.fadeOut(0.3);

        //     setTimeout(() => {
        //         this.actions[FoxAnimations.Walk]?.stop();
        //         this.isSurveying = false;
        //         this.surveyFinishedCallback?.();
        //     }, 300);
        // }
    }
}

enum FoxAnimations {
    Survey = 'Survey',
    Walk = 'Walk',
    Run = 'Run'
}

type FoxActions = { [key in FoxAnimations]: THREE.AnimationAction | null };