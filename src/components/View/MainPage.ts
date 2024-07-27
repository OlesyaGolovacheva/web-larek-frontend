import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ICardsConteiner {
	catalog: HTMLElement;
}
export class MainPage extends Component<ICardsConteiner>{
	protected _catalog: HTMLElement;
	protected wrapper: HTMLElement;
	protected basketButton: HTMLElement;
	protected _basketCounter: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container)

		this._catalog = ensureElement<HTMLElement>('.gallery');
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this.basketButton = ensureElement<HTMLButtonElement>('.header__basket');
		this._basketCounter.textContent = Number(0).toString();

		this.basketButton.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}

	set basketCounter(value: number) {
		this._basketCounter.textContent = value.toString();
	}
}