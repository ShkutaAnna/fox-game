// import * as THREE from 'three';

export class AnimationProgressTracker {
    private lastStep = -1;

    constructor(
        private readonly step = 0.1
    ) {}

    update(
        time: number,
        duration: number,
        onProgress: (progress: number) => void
    ) {
        if (duration <= 0) return;

        const progress = Math.min(time / duration, 1);
        const currentStep = Math.floor(progress / this.step);

        if (currentStep > this.lastStep) {
            this.lastStep = currentStep;

            onProgress(
                Math.min(currentStep * this.step, 1)
            );
        }
    }

    reset() {
        this.lastStep = -1;
    }
}