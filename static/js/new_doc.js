var i = 1;
  function addRow() {
    // Получаем ссылку на таблицу
    var table = document.getElementById('DocTable');
    // Создаем новую строку и ячейки
    var newRow = table.insertRow();

    // Создаем переменные , каждая из которых будет отвечать за ячейку в данной строке
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    var cell4 = newRow.insertCell();

    // Задаем стиль для ячеек таблицы, чтобы текст был выровнен по центру
    newRow.style.textAlign = "center";
    cell1.style.textAlign = "center";
    cell2.style.textAlign = "center";
    cell3.style.textAlign = "center";
    cell4.style.textAlign = "center";

    // Здесь вы можете установить значения для новых ячеек,
    // если они зависят от дополнительных данных или пользовательского ввода
    var value = i+1
    cell1.innerHTML = '<input name=name="npp_new'+i+'" required="required" size="25" type="text" value="'+value+'" style="width: 30px;">';
    cell2.innerHTML = '<input name="in_work_name_new'+i+'" required="required" size="25" type="text">';
    cell3.innerHTML = '<input name="in_date_new'+i+'" required="required" size="10" type="date">';
    cell4.innerHTML = '<input name="in_sum_stage_new'+i+'" required="required" size="10" type="text" >';

	// Создаем кнопку "Удалить" для строки
    var deleteButton = document.createElement('input');
    deleteButton.type = 'image';
    deleteButton.src = '/static/admin/img/icon-deletelink.svg';
//    deleteButton.src = '/media/img/del_urna.svg';
    deleteButton.alt = 'Удалить';
    deleteButton.title = 'Удалить';
    deleteButton.style = 'width: 20px; height: 20px; margin-top: -10px;';

    // Привязываем обработчик события для кнопки "Удалить"
    deleteButton.addEventListener('click', function() {
      table.deleteRow(newRow.rowIndex); // Удаляем строку из таблицы
    });

    // Добавляем кнопку "Удалить" в ячейку
    var deleteCell = newRow.insertCell();
    deleteCell.appendChild(deleteButton);

    // Увеличиваем счетчик для следующего нажатия
    i++;
    }