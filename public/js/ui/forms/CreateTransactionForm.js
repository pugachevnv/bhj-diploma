/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const selectorAccounts = this.element.querySelector(".accounts-select");
    Account.list({}, (err, response) => {
      if (response && response.success){
        
        const optionsHTML = response.data.reduce((option, item) => {
          option += `<option value="${item.id}">${item.name}</option>`;
          return option;
        }, '');
        
        selectorAccounts.innerHTML = optionsHTML;
        
      } else {
        alert(err);
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response && response.success){
        this.element.reset();
        const newTransaction = this.element.closest('.modal').dataset.modalId;

        App.getModal(newTransaction).close();
        App.update();
      } else {
        alert(err);
      }
    });
  }
}