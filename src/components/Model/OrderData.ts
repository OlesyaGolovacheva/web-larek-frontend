import { IOrder, IOrderData, TPaymentInfo, TContactsInfo, TFormErrors } from '../../types';
import { IEvents } from '../base/events';


export class OrderData implements IOrderData {
	protected _paymentInfo: TPaymentInfo;
	protected _contactsInfo: TContactsInfo;
    protected formErrors: TFormErrors = {};

    constructor(protected events: IEvents) {
		this.clearPayment();
		this.clearContacts();
	}


	clearPayment() {
		this._paymentInfo = {
			address: '',
			payment: null,
		};
	}

	clearContacts() {
		this._contactsInfo = {
			email: '',
			phone: '',
		};
	}

	checkValidation() {
		const errors: typeof this.formErrors = {};
		if (!this._paymentInfo.payment) {
			errors.payment = 'Выберите способ оплаты';
		}
		if (!this._paymentInfo.address) {
			errors.address = 'Укажите адрес доставки';
		}
		if (!this._contactsInfo.email) {
			errors.email = 'Укажите адрес электронной почты';
		}
		if (!this._contactsInfo.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	set paymentInfo(info: TPaymentInfo) {
		this._paymentInfo.payment = info.payment;
		this._paymentInfo.address = info.address;
		this.validatePaymentInfo();
	}

	set contactsInfo(info: TContactsInfo) {
		this._contactsInfo.email = info.email;
		this._contactsInfo.phone = info.phone;
		this.validateContactInfo();
	}

  	updateInputFields( field: keyof IOrder, value: string ) {
		if (field==='address' ) {
			this._paymentInfo.address= value;
			this.validatePaymentInfo();
		} 
		if (field==='phone' ) {
			this._contactsInfo.phone= value;
			this.validateContactInfo();
		} 
		if (field==='email' ) {
			this._contactsInfo.email= value;
			this.validateContactInfo();
		} 
	}

	get paymentInfo() {
		return this._paymentInfo;
	}

	get contactsInfo() {
		return this._contactsInfo;
	}

	validateContactInfo(){
		if (this.checkValidation()) {
			this.events.emit('сontacts:ready', this.contactsInfo);
		}
	}

	validatePaymentInfo(){
		if (this.checkValidation()) {
			this.events.emit('payment:ready', this.paymentInfo);
		}
	}
}