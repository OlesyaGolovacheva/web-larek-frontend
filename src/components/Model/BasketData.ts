import { IEvents } from '../base/events';
import { IBasket, IProduct } from '../../types';

export class BasketData implements IBasket {
	protected _cardsInBasket: IProduct[];
	protected _total: number;

	constructor(protected events: IEvents) {
		this.clearBasket();
	}

	getTotal() {
		return this.cardsInBasket.reduce((res, current) => {
			return res + current.price;
		}, 0);
	}

	getProductIdsInBasket(): string[] {
		return this.cardsInBasket
			.map((card) => card.id);
	}

	get total() {
		return this.cardsInBasket.reduce((res, current) => {
			return res + current.price;
		}, 0);
	}

	isInBasket(productId: string) {
		const cardId = this.cardsInBasket.find(
			(product) => product.id === productId
		);
		return cardId !== undefined;
	}

	getProductsInBasket(): IProduct[] {
		return this.cardsInBasket.filter((item) => this.isInBasket(item.id));
	}

	addProduct(product: IProduct) {
		if (!this.isInBasket(product.id)) {
			this.cardsInBasket = [...this.cardsInBasket, product];
		}
	}

	deleteProduct(id: string) {
		this.cardsInBasket = this.cardsInBasket.filter((cards) => cards.id !== id);
	}

	clearBasket() {
		this.cardsInBasket = [];
		this._total = 0;
	}

	get cardsInBasket() {
		return this._cardsInBasket;
	}

	protected set cardsInBasket(cardsInBasket: IProduct[]) {
		this._cardsInBasket = cardsInBasket;
	}
}