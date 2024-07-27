import { Form } from "../common/Form";
import { IEvents } from "../base/events";
import { TContactsInfo } from "../../types";

interface IFormOfContact {
	email: string;
	phone: string;
}

export class Contacts extends Form<TContactsInfo> implements IFormOfContact
{
	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
        
		this.inputPhone = this.container.elements.namedItem('phone') as HTMLInputElement;
		this.inputEmail = this.container.elements.namedItem('email') as HTMLInputElement;
	}

	set phone(value: string) {
		this.inputPhone.value = value;
	}

	get phone() {
		return this.inputPhone.value;
	}

	set email(value: string) {
		this.inputEmail.value = value;
	}

	get email() {
		return this.inputEmail.value;
	}
}