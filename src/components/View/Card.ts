import { IEvents } from './../base/events';
import { ICard, ICardAction, CategoryType } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

const categoryClasses: Record<CategoryType, string> = {
	[CategoryType.OTHER]: 'card__category_other',
	[CategoryType.SOFT_SKILL]: 'card__category_soft',
	[CategoryType.ADDITIONAL]: 'card__category_additional',
	[CategoryType.BUTTON]: 'card__category_button',
	[CategoryType.HARD_SKILL]: 'card__category_hard',
};


// класс для карточки товара
export class Card extends Component<ICard> {
    protected events: IEvents;
	protected cardId: string;
	protected cardTitle: HTMLHeadingElement;
	protected cardPrice: HTMLSpanElement;
	protected cardImage: HTMLImageElement;
	protected cardCategory: HTMLSpanElement;
	protected cardDescription: HTMLParagraphElement;
	protected button: HTMLButtonElement;
	protected cardIndex: HTMLSpanElement;

	constructor(container: HTMLTemplateElement, events: IEvents, action?: ICardAction) {

        super(container)
        this.events = events;
		this.cardTitle = ensureElement<HTMLHeadingElement>('.card__title', this.container);
		this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', this.container);
		this.cardImage = this.container.querySelector(`.card__image`);
		this.cardCategory = this.container.querySelector(`.card__category`);
		this.cardDescription = this.container.querySelector(`.card__text`);
		this.button = this.container.querySelector(`.card__button`);
        this.cardIndex = this.container.querySelector('.basket__item-index');

        // добавление обработчика события на кнопку или контейнер
		if (action?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', action.onClick);
			} else {
				this.container.addEventListener('click', action.onClick);
			}
		}
	}

    // устанавливаем категорию
	set category(value: CategoryType) {
		this.setText(this.cardCategory, value);
		this.cardCategory.classList.add(categoryClasses[value]);
	}

	set index(index: number) {
		if (this.cardIndex) {
			let text = index.toString();
			this.setText(this.cardIndex, text)
		}
	}

	// получаем и устанавливаем ID
	get id(): string {
		return this.cardId || '';
	}
    set id(id: string) {
		this.cardId = id;
	}

	// получаем и устанавливаем заголовок
	get title(): string {
		return this.cardTitle.textContent || '';
	}
    set title(title: string) {
		this.setText(this.cardTitle, title);
	}

	// устанавливаем цену
	set price(price: number | null) {
		this.setText(this.cardPrice, price ? `${price} синапсов` : `Бесценно`);
	}

	// устанавливаем описание
    set description(description: string) {
		this.setText(this.cardDescription, description);
	}

	// устанавливаем изображение
	set image(src: string) {
		this.setImage(this.cardImage, src, this.title);
	}

	// меняем состояние кнопки
	set inBasket(state: boolean) {
		this.setDisabled(this.button, state);
	}
    
}