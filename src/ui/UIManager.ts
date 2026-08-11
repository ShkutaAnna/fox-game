import { ActionButton } from "./ActionButton";
import { Header } from "./Header";

export class UIManager {
    private header = new Header();
    private actionButton = new ActionButton();

    constructor(
        public onAction: () => void,
    ) {
        document.body.appendChild(this.header.header);
        document.body.appendChild(this.actionButton.button);

        this.actionButton.button.addEventListener('click', () => {
            this.onAction();
        });
    }

    public setActionButtonState(isDisabled: boolean) {
        if (isDisabled) {
            this.actionButton.button.classList.add('disabled');
            return;
        } else {
            this.actionButton.button.classList.remove('disabled');
        }
    }
}