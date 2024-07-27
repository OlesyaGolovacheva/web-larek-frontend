import { IProduct, IMainPage } from '../../types';
import { IEvents } from '../base/events';

export class ProductsData implements IMainPage{
	protected _productList: IProduct[];
  	protected _preview: string | null;
  	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set productList(data: IProduct[]) {
		this._productList = data;
		this.events.emit('cards:changed', this._productList);
	}

	get productList():IProduct[] {
		return this._productList;
	}

	getPreview(id: string): IProduct {
		return this._productList.find((item: IProduct) => item.id === id);
	}

	get preview() {
		return this._preview;
	}
}