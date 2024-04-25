  var i = 0;
  function addRow() {
    // Получаем ссылку на таблицу
    var table = document.getElementById('myTable');
    // Создаем новую строку и ячейки
    var newRow = table.insertRow();

    // Создаем переменные , каждая из которых будет отвечать за ячейку в данной строке
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    var cell3 = newRow.insertCell();
    var cell4 = newRow.insertCell();
    var cell5 = newRow.insertCell();
    var cell6 = newRow.insertCell();
    var cell7 = newRow.insertCell();
    var cell8 = newRow.insertCell();
    var cell9 = newRow.insertCell();
    var cell10 = newRow.insertCell();
    var cell11 = newRow.insertCell();
    var cell12 = newRow.insertCell();
    var cell13 = newRow.insertCell();
    var cell14 = newRow.insertCell();
    var cell15 = newRow.insertCell();
    var cell16 = newRow.insertCell();

    // Задаем стиль для ячеек таблицы, чтобы текст был выровнен по центру
    newRow.style.textAlign = "center";
    cell1.style.textAlign = "center";
    cell2.style.textAlign = "center";
    cell3.style.textAlign = "center";
    cell4.style.textAlign = "center";
    cell5.style.textAlign = "center";
    cell6.style.textAlign = "center";
    cell7.style.textAlign = "center";
    cell8.style.textAlign = "center";
    cell9.style.textAlign = "center";
    cell10.style.textAlign = "center";
    cell11.style.textAlign = "center";
    cell12.style.textAlign = "center";
    cell13.style.textAlign = "center";
    cell14.style.textAlign = "center";
    cell15.style.textAlign = "center";
    cell16.style.textAlign = "center";

    // Здесь вы можете установить значения для новых ячеек,
    // если они зависят от дополнительных данных или пользовательского ввода
    cell1.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="npp_new'+i+'" type="text" class="date-input-npp" value="0" style="width: 30px;"></span>';
    cell2.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black">-</span>';
    cell3.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="work_name_new'+i+'" type="text" style="width: 120px;"></span>';
    cell4.innerHTML = '<input name="flag_stage_work_doc_date_new'+i+'" type="checkbox">';
    cell5.innerHTML = '<input name="flag_stage_pay_doc_date_new'+i+'" type="checkbox">';
    cell6.innerHTML = '<input name="flag_stage_upd_doc_date_new'+i+'" type="checkbox">';
    cell7.innerHTML = '<input name="flag_doc_date_new'+i+'" type="checkbox">';
    cell8.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="sum_stage_new'+i+'" type="text" style="width: 120px;" value="0.0"></span>';
    cell9.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="num_pp_new'+i+'" type="text" style="width: 200px;"></span>';
    cell10.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="date_pp_new'+i+'" type="date" style="width: 100px;"></span>';
    cell11.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="payment_new'+i+'" type="text" style="width: 100px;">';
    cell12.innerHTML = '<input name="flag_invoice_issued_new'+i+'" type="checkbox">';
    cell13.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="date_act_new'+i+'" type="date" style="width: 100px;"></span>';
    cell14.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="num_act_new'+i+'" type="text" style="width: 200px;"></span>';
    cell15.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="date_new'+i+'" type="date" style="width: 100px;"></span>';
	cell16.innerHTML = '<span style="font-size:12pt; font-family:Calibri,sans-serif; color:black"><input name="comment_new'+i+'" type="text" style="width: 200px;"></span>';

	// Создаем кнопку "Удалить" для строки
    var deleteButton = document.createElement('input');
    deleteButton.type = 'image';
    deleteButton.src = '/static/admin/img/icon-deletelink.svg';
//    deleteButton.src = '/media/img/del_urna.svg';
    deleteButton.alt = 'Удалить';
    deleteButton.title = 'Удалить';
    deleteButton.style = 'width: 20px; height: 20px;';

    // Привязываем обработчик события для кнопки "Удалить"
    deleteButton.addEventListener('click', function() {
      table.deleteRow(newRow.rowIndex); // Удаляем строку из таблицы
    });

    // Добавляем кнопку "Удалить" в ячейку
    var deleteCell = newRow.insertCell();
    deleteCell.appendChild(deleteButton);

    // Увеличиваем счетчик для следующего нажатия
    i++;
	// Обновляем значение скрытого поля
    document.getElementById('counterField').value = i;
    }


//Отправка пост запросов без перезагрузки страниц
// В данной функции мы берем специальный ключ для джанго из кэша
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function save_ajax(id_form='form_for_ajax',url='/list_doc/change_status_doc/', save='save'){
        var form = document.getElementById(id_form);
        // Создать объект FormData и добавить значение каждого измененного элемента
        var formData = new FormData(form);
        var messageDiv = $('#message');
        messageDiv.html('Ожидайте, идет сохранение данных!');
        console.log('Ожидайте, идет сохранение данных!');
        messageDiv.addClass('info');
        messageDiv.show();
        formData.append(save, true);
        // Создать AJAX-запрос
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        // Получить CSRF токен из куки и добавить его в заголовок запроса
        var csrftoken = getCookie('csrftoken');
        xhr.setRequestHeader('X-CSRFToken', csrftoken);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {


                if (xhr.status === 200) {
                    messageDiv.html('Данные успешно сохранены!');
                    console.log('Данные успешно сохранены!');
                    messageDiv.addClass('success');



                } else {
                    messageDiv.html('Произошла ошибка при сохранении данных.');
                    console.log('Произошла ошибка при сохранении данных.');
                    messageDiv.addClass('error');
                }

                messageDiv.show();

                // Скрытие сообщения через 5 секунд
                setTimeout(function() {
                    messageDiv.hide();
                    messageDiv.removeClass('success error');
                }, 2500);
            }
        };
                                            xhr.send(formData);

                                            };