export interface IProduct {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string
}

export interface IOrder {
    _id: string;
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: IProduct[];
}

export interface IMainPage {
    items: IProduct[];
    preview: string | null;
    counter: number;
}

export interface IBasket {
    productList: TItemBasket[];
    addProduct(value: IProduct): void;
    deleteProduct(id: string): void;
    getTotal(): number;
    getQuantity(): number;
    clearBasket(): void;
    checkValidation(): boolean;
}

export interface IOrderData {
	paymentInfo: TPaymentInfo;
	contactsInfo: TContactsInfo;
	clearOrder(): void;
	clearContacts(): void;
	checkValidation(): boolean;
    getOrderData(): IOrder;
}

export type TItemBasket = Pick<IProduct, '_id'|'title'|'price'>;

export type TPaymentInfo = Pick<IOrder, 'payment'|'address'>;

export type TPayment = 'card' | 'cash';

export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>;

export type TSuccessfulPayment = Pick<IBasket, 'getTotal'>;