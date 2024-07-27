import { IOrder, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

export type OrderResponse = {
    id: string,
    total: number
}

export interface IWebLarekApi {
	getProducts(): Promise<IProduct[]>;
	getProductById(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<OrderResponse>;
}


export class WebLarekApi extends Api implements IWebLarekApi {
	cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProducts(): Promise<IProduct[]>  {
		return this.get('/product').then((product: ApiListResponse<IProduct>) => 
            product.items.map(item => ({
                ...item, image: this.cdn + item.image
            }))
        );
	}

	getProductById(id: string) {
		return this.get('/product/' + id).then((product: IProduct) => {
			return { ...product, image: this.cdn + product.image };
		});
	}

	postOrder(order: IOrder) {
		return this.post('/order', order).then((success: OrderResponse) => {
			return success;
		});
	}
}