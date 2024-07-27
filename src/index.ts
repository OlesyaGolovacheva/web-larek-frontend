import './scss/styles.scss';
import { ProductsData } from './components/Model/ProductsData';
import { BasketData } from './components/Model/BasketData';
import { OrderData } from './components/Model/OrderData';
import { WebLarekApi } from './components/WebLarekApi';
import { EventEmitter, IEvents } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, IOrder } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { MainPage } from './components/View/MainPage';
import { Card } from './components/View/Card';
import { Basket } from './components/View/Basket';
import { Payment } from './components/View/Payment';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';


const pageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const cardTemplete = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// создаем экземпляр класса брокера событий
const events: IEvents = new EventEmitter();

// создаем экземпляр класса API
const api = new WebLarekApi(CDN_URL, API_URL);

// создаем экземпляры классов моделей данных
const productsData = new ProductsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// создаем экземпляры классов визуализации
const page = new MainPage(pageContainer, events);
const modal = new Modal(modalContainer, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const paymentForm = new Payment(cloneTemplate(paymentTemplate), events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

// блокировка страницы при открытии модального окна
events.on('modal:open', () => {
	page.locked = true;
});

// снятие блокировки страницы при закрытии модального окна
events.on('modal:close', () => {
	page.locked = false;
});

api
.getProducts()
.then((data) => {
    productsData.productList = data;
})
.catch(console.error);

events.on('cards:changed', mainProductList);
events.on('preview:selected', cardPreviewSelect);
events.on('card:toBasket', cardToBasket);
events.on('basket:open', openBasket);
events.on('basket:delete', basketDelete);
events.on('basket:order', basketOrder);
events.on('formErrors:change', formErrors);
events.on('orderInput:change', orderInputValidation);
events.on('payment:submit', paymentSubmit);
events.on('contacts:submit', contactsSubmit);

//выводим список товаров на главной
function mainProductList() {
	page.catalog = productsData.productList.map((item) => {
        const card = new Card(cloneTemplate(cardTemplete), events, {
            onClick: () => events.emit('preview:selected', item),
        });
        return card.render({ ...item });
    });
}

// превью карточки в модальном окне
function cardPreviewSelect(product: IProduct) {
	const card = new Card(cloneTemplate(cardPreviewTemplate), events, {
		onClick: () => events.emit('card:toBasket', product),
	});
    if (!product.price) {
        modal.render({
            content: card.render({ ...product, inBasket: true }),
        });
    } else {
        modal.render({
            content: card.render({ ...product, inBasket: basketData.isInBasket(product.id) }),
        });
    }
	modal.open();
}


// добавление карточки в корзину
function cardToBasket(item: IProduct) {
    // проверяем наличие товара в корзине
	const isProductInCart = basketData.cardsInBasket.find((product) => product.id === item.id);
	if (!isProductInCart) {
		basketData.addProduct(item);
		page.basketCounter = basketData.cardsInBasket.length;
	}
	modal.close();
}


//обрабатываем событие открытия корзины
function openBasket() {
    const basketItems = basketData.cardsInBasket.map((item, index) => {
      const card = new Card(cloneTemplate(basketCardTemplate), events, {
        onClick: () => events.emit('basket:delete', item),
      });
      const renderedItem = card.render({ title: item.title, price: item.price, index: index + 1 });
      return renderedItem;
    });
    
    // обновляем список товаров и стоимость корзины
    modal.render({
      content: basket.render({ basketList: basketItems, basketTotal: basketData.getTotal() }),
    });
    if (!basketData.cardsInBasket.length) {
      basket.disableButton();
    }
    modal.open();
}

function basketDelete(item: IProduct) {
    basketData.deleteProduct(item.id);
    basket.basketTotal = basketData.getTotal();
    const basketItems = basketData.cardsInBasket.map((product, index) => {
      const card = new Card(cloneTemplate(basketCardTemplate), events, {
        onClick: () => events.emit('basket:delete', product),
      });
      const renderedItem = card.render({ title: product.title, price: product.price, index: index + 1 });
      return renderedItem;
    });
  
    basket.basketList = basketItems;
    page.basketCounter = basketData.cardsInBasket.length;
  
    // отключаем кнопку "оформить" если корзина пуста
    if (!basketData.cardsInBasket.length) {
      basket.disableButton();
    }
  }

function basketOrder() {
    orderData.clearPayment();
    modal.render({
		content: paymentForm.render({ valid: false, ...orderData.paymentInfo, errors: [] }),
	});
}

//взаимодействие пользователя с полями формы доставки
events.on('order:valid', () => {
	orderData.paymentInfo = {
		payment: paymentForm.payment,
		address: paymentForm.address,
	};
});

//взаимодействие пользователя с полями формы контактов
events.on('contacts:valid', () => {
	orderData.contactsInfo = {
		email: contactsForm.email,
		phone: contactsForm.phone,
	};
});

// изменилось состояние валидации формы
function formErrors(errors: Partial<IOrder>) {
	const { payment, address, email, phone } = errors;
	paymentForm.valid = !payment && !address;
	contactsForm.valid = !email && !phone;
	paymentForm.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join(';  ');
  contactsForm.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(';  ');
};

// изменились введенные данные
function orderInputValidation (data: { field: keyof IOrder, value: string }) {
    orderData.updateInputFields(data.field, data.value);
};

// перерисовываем контент на форму заполнение контактов
function paymentSubmit() {
    modal.render({
		content: contactsForm.render({ valid: false, ...orderData.contactsInfo, errors: [] }),
	});
};

// отправка формы заказа
function contactsSubmit() {
	// создание промежуточного объекта с данными для отправки на сервер
	const order: IOrder = {
		payment: orderData.paymentInfo.payment,
		address: orderData.paymentInfo.address,
		email: orderData.contactsInfo.email,
		phone: orderData.contactsInfo.phone,
		items: basketData.getProductIdsInBasket(),
		total: basketData.total,
	};

	// преобразуем его в объект с нужным свойством payment
	const orderForServer = {
		  payment: order.payment,
			email: order.email,
			phone: order.phone,
			address: order.address,
			total: order.total,
			items: order.items,
	};

  api
		.postOrder(orderForServer)
		.then((result) => {
			orderData.clearPayment();
			orderData.clearContacts();
			basketData.clearBasket();
      page.basketCounter = basketData.cardsInBasket.length;
      console.log(result);
			modal.render({content:success.render({orderTotal: result.total})});
		})
		.catch((e) => console.error(e));
};

events.on('success:submit', () => {
	modal.close();
});