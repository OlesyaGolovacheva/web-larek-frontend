import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { TOrderSuccessInfo } from '../../types';


export class Success extends Component<TOrderSuccessInfo> {
	protected _orderTotal: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);
		this._orderTotal = ensureElement<HTMLElement>(
			'.order-success__description',
			element
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			element
		);
		this.button.addEventListener('click', () => {
			events.emit('success:submit');
		});
	}

	set orderTotal(value: number) {
		this._orderTotal.textContent = `Списано ${value} синапсов`;
	}
}