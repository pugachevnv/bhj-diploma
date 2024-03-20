/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Переданный элемент не существует!');
    }

    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
    
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.closest('.transaction__remove')) {
        this.removeTransaction(event.target.closest('.transaction__remove'));
      }
    });

    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      if (event.target.closest('.remove-account')){
        this.removeAccount(event.target.closest('.remove-account'));
      }
    });

  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      if (confirm('Вы действительно хотите удалить счёт?')) {        
        Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
          if (response && response.success){
            this.update();
            App.updateWidgets();
            App.updateForms();
            
          } else {
            alert(err);
          };
        });
      } 
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
       
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
    
      Transaction.remove({ id: id.dataset.id}, (err, response) => {
        if (response && response.success){
          this.update();
          App.updateWidgets();
          // App.update();
          // this.clear();
        } else {
          alert(err);
        };
      });
    } 

  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return;
    }
    this.clear();
    this.lastOptions = options;
    Account.get(options.account_id, (err, response) => {
      if (response && response.success){
        
        this.renderTitle(response.data.name)
      } else {
        alert(err);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success){
        this.renderTransactions(response.data);
      } else {
        alert(err);
      }
    });
    
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    console.log('я срабатываю!');
    this.renderTransactions([]);
    this.renderTitle('Название счета');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = this.element.querySelector('.content-title');
    title.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    // const page = new TransactionsPage( document.getElementById( '#content' ));
    // page.formatDate( '2019-03-10 03:20:41' );
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
      <div class="transaction transaction_${item.type} row">
          
          <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>

              <div class="transaction__info">
                  <h4 class="transaction__title">${item.name}</h4>
                  <div class="transaction__date">10 марта 2019 г. в 03:20</div>
              </div>
          </div>

          <div class="col-md-3">
              <div class="transaction__summ">
                  ${item.sum} <span class="currency">₽</span>
              </div>
          </div>

          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>

      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    
    data.forEach(item => {
      const transactionHTML = this.getTransactionHTML(item);
      this.element.querySelector('.content').insertAdjacentHTML("beforeEnd", transactionHTML);
    })
  }
}