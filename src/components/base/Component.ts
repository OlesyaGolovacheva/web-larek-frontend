import { IEvents } from './events';

/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement, protected readonly events?: IEvents) {}

	// переключить класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	// установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// скрыть
	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	// показать
	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	// установить изображение с альтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}