import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/Component";

interface IBasketList {    
    basketList: HTMLElement[],
    basketTotal: number
}

export class Basket extends Component<IBasketList> {
    protected _basketList: HTMLElement | null;
    protected _basketTotal: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(element: HTMLElement, protected events: IEvents) {
        super(element);
        this._basketList = ensureElement<HTMLElement>('.basket__list', element);
        this._basketTotal = ensureElement<HTMLElement>('.basket__price', element);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', element);

        this.button.addEventListener('click', () =>
            this.events.emit('basket:order')
        );
    }
    
    set basketTotal(value: number) {
        this._basketTotal.textContent = `${value.toString()} синапсов`;
    }
    
    set basketList(items: HTMLElement[]) {
        this._basketList.replaceChildren(...items);
    }

    disableButton() {
        this.setDisabled(this.button, true);
      }
}