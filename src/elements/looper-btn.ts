import { css, customElement, html, LitElement, property } from 'lit-element';

/**
 * Some of the functions were taken from https://github.com/LironHazan/wokwi-elements/blob/master/src/pushbutton-element.ts
 */
@customElement('rocking-btn')
export class LooperBtnElement extends LitElement {
    @property() color = 'red';
    @property() pressed = false;

    static get styles() {
        return css`
    `;
    }

    render() {
        const { color } = this;
        return html`
        <div> Fake btn </div>
    `;
    }

    private down() {
        if (!this.pressed) {
            this.pressed = true;
            this.dispatchEvent(new Event('button-press'));
        }
    }

    private up() {
        if (this.pressed) {
            this.pressed = false;
            this.dispatchEvent(new Event('button-release'));
        }
    }
}
