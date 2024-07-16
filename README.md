# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Карточка товара

```
export interface IProduct {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    image: string
}
```

Интерфейс заказа

```
export interface IOrder {
    _id: string;
    payment: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: IProduct[];
}
```

Модель для хранения коллекции карточек на главной

```
export interface IMainPage {
    items: IProduct[];
    preview: string | null;
    counter: number;
}
```

Интерфейс корзины

```
export interface IBasket {
    productList: TItemBasket[];
    addProduct(value: IProduct): void;
    deleteProduct(id: string): void;
    getTotal(): number;
    getQuantity(): number;
    clearBasket(): void;
    checkValidation(): boolean;
}
```
Интерфейс оформления заказа

```
export interface IOrderData {
    paymentInfo: TPaymentInfo;
    contactsInfo: TContactsInfo;
    clearOrder(): void;
    clearContacts(): void;
    checkValidation(): boolean;
    getOrderData(): IOrder;
}
```

Данные для модального окна просмотра корзины

```
export type TItemBasket = Pick<IProduct, 'title'|'price'>;
```

Данные покупателя в форме заполнения адреса доставки и выбора формы платежа

```
export type TPaymentInfo = Pick<IOrder, 'payment'|'address'>;
```

Данные покупателя в форме заполнения контактных данных (телефон и e-mail)

```
export type TContactsInfo = Pick<IOrder, 'email' | 'phone'>;
```

Данные для модального окна успешной оплаты

```
export type TSuccessfulPayment = Pick<IBasket, 'getTotal'>;
```

Тип оплаты
```
export type TPayment = 'card' | 'cash';
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
  - слой представления, отвечает за отображение данных на странице,
  - слой данных, отвечает за хранение и изменение данных
  - презентер, отвечает за связь представления и данных.

## Базовый код

### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
  - `handleResponse` - обрабатывает ответа с сервера. Если ответ с сервера пришел, то возвращается его в формате json, в противном случае формирует ошибку
  - `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
  - `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
  - `on` - подписка на событие
  - `emit` - инициализация события
  - `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс ProductsData
Класс отвечает за хранени данных о товарах.
Конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:

  - _productList: IProduct[] - массив объектов товаров 
  - _preview: string | null - id карточки, выбранной для просмотра в модальном окне
  - counter: number - счетчик товаров в корзине
  - events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными:

  - get productsList(): IProduct[] - возвращает массив товаров.
  - get preview(): string | null - возвращает выбранную карточку товара.

#### Класс BasketData
Класс отвечает за хранение данных товаров в корзинею
Конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:

  - _productList: TItemBasket[] - коллекция товаров в корзине
  - _total: number - итоговая стоимость товаров в корзине
  - events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными:

  - addProduct(value: TItemBasket[]): void - добавляет товар в корзину и вызывает событие изменение массива
  - deleteProduct(id: string): void - удаляет товар из корзины и вызывает событие изменение массива
  - checkValidation(): boolean - валидирует данные заказа
  - clearBasket(): void - очищает корзину
  - getProductList(): TItemBasket[] - список товаров в корзине
  - getTotal(): number - сумма заказа
  - getQuantity(): number - возвращает текущее количество товаров в корзине

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказа.
Конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:

  - _paymentInfo: TPaymentInfo - платежная информация
  - _contactInfo: TContactsInfo - контактная информация
  - order: IOrder - заказ
  - events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

  - getOrderData(): IOrder- для получения данных о заказе
  - clearPaymentInfo(): void - очищает данные о способе оплаты и адресе
  - clearContactsInfo(): void - очищает контактные данные покупателя
  - checkValidation(): boolean - валидирует поля _paymentInfo и _contactInfo
  - set paymentInfo(info: TPaymentInfo): void - запись платежной информации
  - get paymentInfo(): TPaymentInfo - возвращает данные о способе оплаты и адресе
  - set contactsInfo(info: TContactsInfo): void - запись контактной информации
  - get contacstInfo(): TContactsInfo - возвращает контактную информацию

### Классы представления

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс MainPage
Представляет собой компонент для отображения главной страницы приложения, отвечает за отображение списка товаров и иконку корзины покупателя со счетчиком товаров.

Поля класса:

  - _catalog: HTMLElement[] - контейнер для каталога товаров
  - basketButton: HTMLElement - кнопка открытия корзины в модальном окне
  - basketCounter: HTMLElement - элемент счетчика товаров в корзине

Методы класса:

  - set lock(value: boolean) - устанавливает состояние блокировки страницы.
  - set count(value: number) - устанавливает счетчик товаров в корзине.
  - set productList(items: HTMLElement[]) - выводит товары на страницу.

#### Класс CatalogCard
Отвечает за отображение карточки товара в каталоге. Устанавливает значения следующих элементов:

  - _category: HTMLElement - категория товара
  - _title: HTMLElement - заголовок товара
  - _image: HTMLImageElement - изображение товара
  - _price: HTMLElement - стоимость товара

В конструктор передается элемент карточки и объект с обработчиком события. По клику на карточку открывается модальное окно с информацией о товаре.

#### Класс Modal
Реализует модальное окно. Предназначен для отображения таких компонентов как PreviewProduct, Basket, Payment, Contacts, Success. Так же представляет методы `open` и `close` для управления отображением модального окна, устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия попапа.

Поля класса:

  - _content: HTMLElement - содержимое модального окна
  - events: IEvents - брокер событий

Методы класса:

  - open() - метод отображения модального окна, запускает событие, блокирующее прокрутку страницы
  - close() - метод для закрытия модального окна, запускает событие, разблокирующее прокрутку страницы
  - set content(value: HTMLElement): void - для возможности изменения внутреннего содержимого модального окна

#### Класс PreviewProductCard
Отвечает за отображение подробной информации о товаре и возможностью добавления его в корзину.

Поля класса:
  - _id - id выбранной карточки
  - _image: HTMLImageElement - изображение товара
  - _category: HTMLElement - категория товара
  - _title: HTMLElement - заголовок товара
  - _description: HTMLElement - описание товара
  - _price: HTMLElement - стоимость товара

Методы класса:
  - set product(): IProduct - устанавливает инофрмацию о товаре, в случае если цена продукта равна null то в поле с ценой записывается строка бесценно.
  - set inBasket(): boolean - если true, то отключает кнопку добавить в корзину и меняет её текст на 'в корзине'.
  - render - принимает в качестве параметров product: IProduct, inBasket: boolean.

#### Класс ProductBasket
Отвечает за отображение списка выбранных товаров и общей стоимости заказа.

Поля класса:

  - _basketList: HTMLElement - элемент-контейнер списка товаров
  - _basketPrice: HTMLElement - элемент с текстом об общей стоимости товаров в корзине

В конструктор передается элемент корзины и объект с обработчиком события. Обработчик устанавливается на кнопку начала заказа. Если в корзине нет товаров, кнопка заблокирована и отображается текст сообщения об ошибке.

#### Класс BasketCard
Отвечает за отображение элемента товара в списке товаров корзины.

Ипользует для отображения TItemBasket, где:
  - _itemIndex: HTMLElement - порядковый номер товара в корзине, берется из массива
  - _title: HTMLElement - заголовок карточки товара
  - _price: HTMLElement - стоимость товара

В конструктор передается элемент карточки и объект с обработчиком события клика по кнопке удаления товара из корзины.

#### Класс Form
Является абстрактным классом дженериком и шаблоном для форм приложения. Реализует пользовательский функционал с формами.

Поля класса:

  - container: HTMLFormElement - соответствующая форма
  - inputsList: HTMLInputElement[] - массив input элементов формы
  - submitButton: HTMLButtonElement - кнопка отправки данных формы
  - _errors: HTMLElement - html элемент для отображения текста ошибок формы, при наличии/отсутствии ошибок - блокирует/разблокирует кнопку подтверждения данных формы.

Методы класса:

  - get valid(): boolean - получения статуса валидности формы
  - set valid(value: boolean):void - сеттер для блокировки/разблокировки кнопки submit
  - set errors(value: string) - установка текста ошибок
  - clear():void - очистка формы при её закрытии

#### Класс Payment
Отвечает за отображение первого окна формы заказа. Расширяет базовый класс Form.

Поля класса:

  - cardButton: HTMLButtonElement - оплата онлайн
  - cashButton: HTMLButtonElement - оплата при получении заказа
  - inputAddress: HTMLInputElement - поле ввода адреса доставки заказа

Методы класса:

  - get payment(): TPayment - возвращает способ оплаты
  - get address(): string - возвращает адрес доставки заказа
  - get valid(): boolean - возвращает валидность формы
  - clear(): void - очищает форму и снимает класс активности с кнопок

#### Класс Contacts
Отвечает за отображение второго окна формы заказа. Класс расширяет базовый класс Form.

Устанавливает значения следующих элементов:

Поля класса:

  - emailInput: HTMLInputElement - поле ввода адреса email
  - phoneInput: HTMLInputElement - поле ввода телефона

Методы класса:

  - get email(): string - возвращает email
  - get phone(): string - возвращает номер телефона
  - get valid(): boolean - возвращает валидность формы

#### Класс Success
Отвечает за отображение блока подтверждения заказа.

Поля класса:

  - buttonOrderSuccess: HTMLButtonElement - кнопка "За новыми покупками"
  - _orderTotal: HTMLElement - элемент для отображения общей стоимости заказа
  - events: IEvents - экзепляр брокера событий

Методы класса:

  - set orderTotal(total: number): void - устанавливает количество потраченных средств

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

Методы класса:

  - getProducts(): Promise<ICard[]> - получает с сервера массив объектов всех товаров
  - getProductById(id: string): Promise<ICard> - получает с сервера конкретный товар по id
  - postOrder(order: IOrder): Promise<TSuccessData> - отправляет post запрос на сервер, содержащий данные о заказе и получает по итогу номер заказа (id) и общую сумму заказ (total).

## Взаимодействие компонентов

Код, описывающий взаимодействие представления и данных между собой находится в файле index.ts, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts\
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Список событий, которые могут генерироваться в системе:

События изменения данных (генерируются классами моделями данных):
  - cards:changed - изменение массива данных продуктов
  - productList:changed - изменение массива покупок
  - success:changed - событие, возникающее при получении успешного заказа.

События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление):

  - modal:open - открытие модального окна
  - modal:closed - закрытие модального окна
  - card:select - выбор карточки товара для отображения в модальном окне
  - card:add - добавление товара в корзину
  - card:delete - удаление товара из корзины
  - basket:submit - нажатие на кнопку оформления заказа в корзине
  - productList:change - изменение списка товаров в корзине (при добавлении и удалении товара)
  - payment:valid - взаимодествие пользователя с полями формы способа оплаты
  - payment:submit - успешное прохождение формы со способом оплаты и адреса
  - contacts:valid - взаимодествие пользователя с полями формы контактных данных
  - contacts:submit - успешное прохождение формы контактных данных.
  - success: submit - успешное оформлении заказа и возвращение к списку товаров