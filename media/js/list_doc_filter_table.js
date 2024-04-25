
var doc_open="true"
var doc_bild_done="true"
var do_index = -1; // Индекс столбца для doc_open
var dbd_index = -1; // Индекс столбца для doc_bild_done

var procent_index = -1;
var sum_stage_index = -1;
var accomplishment_index = -1;
var payment_index = -1;
var payment_upd_index = -1;
var accomplishment_index = -1;
var balance_contract_index = -1;
var result_index = -1;

// Функция для форматирования числа с разделителями тысяч
function formatNumberWithThousandsSeparator(number) {
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(number);
}
  /////////////////////////////////////////////////////////////////////////////////////////////////
 //Фильтр по значениям в таблице открыт договор и строительная готовность, работает через кнопки//
/////////////////////////////////////////////////////////////////////////////////////////////////
function filterTableButton(doc_open_value="true", doc_bild_done_value="true") {
    window.doc_open=doc_open_value
    window.doc_bild_done=doc_bild_done_value
  var table, tr, td;
  table = document.getElementById("DocTable");
  tr = table.getElementsByTagName("tr");

  let button1 = document.getElementById("btn-group-1");
  let button2 = document.getElementById("btn-group-2");
  let button3 = document.getElementById("btn-group-3");
  if (doc_open_value === "true" && doc_bild_done_value === "true"){
    button1.className = 'btn btn-primary';
    button2.className = 'btn btn-dark';
    button3.className = 'btn btn-dark';
  }else{
      if (doc_open_value === "false" && doc_bild_done_value === "true"){
        button1.className = 'btn btn-dark';
        button2.className = 'btn btn-primary';
        button3.className = 'btn btn-dark';
      }else{
        button1.className = 'btn btn-dark';
        button2.className = 'btn btn-dark';
        button3.className = 'btn btn-primary';
      }
  }

  if (do_index === -1 && dbd_index === -1){
      // Находим заголовочную строку таблицы (первую строку)
      var headerRow = tr[1];
      td = headerRow.getElementsByTagName("td");

      // Ищем индексы столбцов, соответствующих поиску

      for (var j = 0; j < td.length; j++) {
        var headerText = td[j].textContent || td[j].innerText;
        if (headerText.trim() === "Договор открыт") {
           window.do_index = j;
        }
        if (headerText.trim() === "Нет строительной готовности") {
           window.dbd_index = j;
        }
        if (headerText.trim() === "%") {
           window.procent_index = j;
        }
        if (headerText.trim() === "Сумма договора, руб.") {
           window.sum_stage_index = j;
        }
        if (headerText.trim() === "Выполнение, руб.") {
           window.accomplishment_index = j;
        }
        if (headerText.trim() === "Остаток по договору, руб.") {
           window.balance_contract_index = j;
        }
        if (headerText.trim() === "ИТОГО задолженность покупателя, руб.") {
           window.result_index = j;
        }
        if (headerText.trim() === "Оплачено, руб.") {
           window.payment_index = j;
        }
        if (headerText.trim() === "Оплачено по УПД, руб.") {
           window.payment_upd_index = j;
        }
      }
  }
  var npp = 0;

  var procentList = [];
  var procentList_archive = [];
  var sum_stage = 0;
  var accomplishment = 0;
  var payment = 0;
  var payment_upd = 0;
  var balance_contract = 0;
  var result = 0;
  // Проходим по каждой строке таблицы, начиная с индекса 2 (пропускаем первые две строки)
  for (var i = 2; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    // Получаем содержимое ячеек в нужных столбцах
    var docOpenValue = td[do_index].textContent || td[do_index].innerText;
    var docBuildDoneValue = td[dbd_index].textContent || td[dbd_index].innerText;

    if (docOpenValue.trim() === "true") {
      // Добавьте процент в массив
      procentList.push(parseFloat(td[procent_index].textContent.replace("%", "")));
    }else{
    procentList_archive.push(parseFloat(td[procent_index].textContent.replace("%", "")));
    }
    // Проверяем значения и скрываем строки, если необходимо
    if (docOpenValue.trim() === doc_open_value && docBuildDoneValue.trim() === doc_bild_done_value) {
      npp++;
      td[0].textContent = npp;
      tr[i].style.display = "";
      // Обновление сумм
      sum_stage += parseFloat(td[sum_stage_index].textContent.replace(/[\s]/g, '').replace(',', '.'));
      accomplishment += parseFloat(td[accomplishment_index].textContent.replace(/[\s]/g, '').replace(',', '.'));
      payment += parseFloat(td[payment_index].textContent.replace(/[\s]/g, '').replace(',', '.'));
      payment_upd += parseFloat(td[payment_upd_index].textContent.replace(/[\s]/g, '').replace(',', '.'));
      balance_contract += parseFloat(td[balance_contract_index].textContent.replace(/[\s]/g, '').replace(',', '.'));
      result += parseFloat(td[result_index].textContent.replace(/[\s]/g, '').replace(',', '.'));

    } else {
      tr[i].style.display = "none";
    }
  }
  // Рассчитайте среднее значение процентов
  var averageProcent = procentList.length > 0 ? procentList.reduce((a, b) => a + b, 0) / procentList.length : 0;
  var averageProcent_archive = procentList_archive.length > 0 ? procentList_archive.reduce((a, b) => a + b, 0) / procentList_archive.length : 0;

  // Обновите значение в последней строке
  td = tr[0].getElementsByTagName("td");
  if (doc_open_value === "true") {
      // Добавьте процент в таблицу
        td[procent_index].textContent = averageProcent.toFixed(0) + "%";}else{td[procent_index].textContent = averageProcent_archive.toFixed(0) + "%";};
  td[sum_stage_index].textContent = formatNumberWithThousandsSeparator(sum_stage.toFixed(2));
  td[accomplishment_index].textContent = formatNumberWithThousandsSeparator(accomplishment.toFixed(2));
  td[payment_index].textContent = formatNumberWithThousandsSeparator(payment.toFixed(2));
  td[payment_upd_index].textContent = formatNumberWithThousandsSeparator(payment_upd.toFixed(2));
  td[balance_contract_index].textContent = formatNumberWithThousandsSeparator(balance_contract.toFixed(2));
  td[result_index].textContent = formatNumberWithThousandsSeparator(result.toFixed(2));
}
  //////////////////////////////////////////////////////////////////////
 //Фильтр по значениям в таблицах , работает через окошко ввода input//
//////////////////////////////////////////////////////////////////////
function NullFilterTable() {
// Обновляем значение скрытого поля
    document.getElementById('filterInput').value = '';
    filterTable()
    }
function filterTable(inputElement = document.getElementById("filterInput").value) {
  var filter, table, tr, td, i, j, txtValue;
  filter = inputElement.toUpperCase();
  table = document.getElementById("DocTable");
  tr = table.getElementsByTagName("tr");

  // Проходим по каждой строке таблицы, начиная с индекса 2 (пропускаем первые две строки)
  for (i = 2; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td");
    var rowVisible = false;
    // Получаем содержимое ячеек в нужных столбцах
    var docOpenValue = td[do_index].textContent || td[do_index].innerText;
    var docBuildDoneValue = td[dbd_index].textContent || td[dbd_index].innerText;

    if (docOpenValue.trim() === doc_open && docBuildDoneValue.trim() === doc_bild_done) {
        for (j = 0; j < td.length-2; j++) {
          if (td[j]) {
            txtValue = td[j].textContent || td[j].innerText;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
              rowVisible = true;
              break;
            }
          }
        }
    }

    // Показываем или скрываем строку в зависимости от значения флага
    tr[i].style.display = rowVisible ? "" : "none";
  }
}
function handleInput(event) {
    filterTable(event.target.value);
}

// выполняется после полной загрузки страницы
document.addEventListener("DOMContentLoaded", function () {
    filterTableButton();
});
