  var i = 0;
  function addRow(data) {
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
    // Проверяем условие: если есть данные, то используем их, иначе оставляем пустые поля
    if (data !== undefined && data !== null && data !== "") {
      cell1.innerHTML = '<input name="npp_' + data.id + '" required="required" size="25" type="text" value="' + data.npp + '" style="width: 30px;">';
      cell2.innerHTML = '<input name="in_work_name_' + data.id + '" required="required" size="25" type="text" value="' + data.work_name + '">';
      cell3.innerHTML = '<input name="in_date_' + data.id + '" size="10" type="date" value="' + data.date_end + '">';
      cell4.innerHTML = '<input name="in_sum_stage_' + data.id + '" size="10" type="text" value="' + data.sum_stage + '">';
    } else {
      value = value+1
      cell1.innerHTML = '<input name="npp_new'+i+'" required="required" size="25" type="text" value="'+value+'" style="width: 30px;">';
      cell2.innerHTML = '<input maxlength="100" name="in_work_name_new' + i + '" required="required" size="25" type="text">';
      cell3.innerHTML = '<input maxlength="10" name="in_date_new' + i + '" size="10" type="date">';
      cell4.innerHTML = '<input maxlength="10" name="in_sum_stage_new' + i + '" size="10" type="text">';
        // Увеличиваем счетчик для следующего нажатия
        i++;
    }

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
$(document).ready(function(){
    $('button.send_save').on('click',function(){
        var form = document.getElementById('form_for_ajax');
        // Создать объект FormData и добавить значение каждого измененного элемента
        var formData = new FormData(form);
        var messageDiv = $('#message');
        messageDiv.html('Ожидайте, идет сохранение данных!');
        console.log('Ожидайте, идет сохранение данных!');
        messageDiv.addClass('info');
        messageDiv.show();
        formData.append('save', true);
        // Создать AJAX-запрос
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '', true);
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

                                            })
                                    });