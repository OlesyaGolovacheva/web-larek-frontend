export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string
}

export interface IOrder {
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IMainPage {
    productList: IProduct[];
    preview: string | null;
    getPreview(id: string): IProduct;
}

export interface IBasket {
    cardsInBasket: TItemBasket[];
	addProduct(value: IProduct): void;
    deleteProduct(id: string): void;
    getTotal(): number;
    clearBasket(): void;
	isInBasket(productId: string): boolean;
	getProductsInBasket(): IProduct[];
	getProductIdsInBasket(): string[];   
}

export interface IOrderData {
	paymentInfo: TPaymentInfo;
	contactsInfo: TContactsInfo;
	clearPayment(): void;
	clearContacts(): void;
	checkValidation(): boolean;
}

export enum CategoryType {
	OTHER = 'другое',
	SOFT_SKILL = 'софт-скил',
	ADDITIONAL = 'дополнительное',
	BUTTON = 'кнопка',
	HARD_SKILL = 'хард-скил',
}

export interface ICard {
    id: string;
	index: number;
	description: string;
	image: string;
	inBasket: boolean;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrderInfo {
    payment: TPayment | null;
    address: string;    
}

export type TItemBasket = Pick<IProduct, 'id'|'title'|'price'>;

export type TPaymentInfo = Pick<IOrder, 'payment'|'address'>;

export type TPayment = 'card' | 'cash';

export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>;

export type TOrderSuccessInfo = {orderTotal: number;};

export type TFormErrors = Partial<Record<keyof IOrder, string>>;

export interface ICardAction {
	onClick: (event: MouseEvent) => void;
}