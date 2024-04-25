const select1 = document.getElementById('select1');
let tbody = document.getElementById('tbody1');
let tbody_other = document.getElementById('tbody2');

let rowCounter = 1; // Счетчик номера п/п
let selectedOptions = {}; // Хранение выбранных элементов и их количества


function filterSelect(selectId, searchId) {
    var input, filter, select, options, option, i, txtValue;
    input = document.getElementById(searchId);
    filter = input.value.toUpperCase();
    select = document.getElementById(selectId);
    options = select.getElementsByTagName("option");

    for (i = 0; i < options.length; i++) {
        option = options[i];
        txtValue = option.textContent || option.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            option.style.display = "";
        } else {
            option.style.display = "none";
        }
    }
}


function clearSelect(selectId) {
    var select = document.getElementById(selectId);

    // Удаление всех опций из селекта
    while (select.options.length > 0) {
        select.remove(0);
    }
}





function ColorsButton(num_btn_primary='1') {
    // всего 5 кнопок каждая имеет свой номер
    // если нужно добавить кнопку то тут надо увеличить с 5 до ...
	for (i = 1; i <= 5; i++) {
		let button = document.getElementById(`btn-group-${i}`);
		tbody_other = document.getElementById(`tbody${i}`);
        tbody_other.style.display="none"
        button.className = 'btn btn-dark';

		if (Number(num_btn_primary) === i) {
			button.className = 'btn btn-primary';
			write_selects(num_btn_primary)
			tbody = document.getElementById(`tbody${num_btn_primary}`);
			tbody.style.display = "table-row-group"
			if (Number(num_btn_primary) === 1){
			// Если у нас выбраны "Сборочные единицы"
			 //То также надо показать табличку "Покупное оборудование"...
                var tbody2 = document.getElementById(`tbody2`);
                // ...и "Детали"
                var tbody5 = document.getElementById(`tbody5`);
                tbody2.style.display = "table-row-group"
                tbody5.style.display = "table-row-group"
			}
			rowCounter = tbody.getElementsByTagName('tr').length;
		}

	}
}

// Добавления поисковой строки к селекту
document.getElementById("search1").addEventListener("input", function () {
    filterSelect("select1", "search1");
});


select1.addEventListener('dblclick', () => {
    const selectedOption = select1.options[select1.selectedIndex];
    if (selectedOption) {
        const optionText = selectedOption.text;
        if (selectedOptions[optionText]) {
            // Если элемент уже выбран, увеличиваем количество
            selectedOptions[optionText]++;
            updateTableRow(optionText, selectedOptions[optionText]);
        } else {
            // Создаем новую строку и добавляем в таблицу
            selectedOptions[optionText] = 1;
            addTableRow(optionText, selectedOptions[optionText]);
        }
    }
});

function addTableRow(optionText, quantity) {
    const newRow = tbody.insertRow();
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.textContent = rowCounter++;
    cell2.textContent = optionText;

    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('quantity-input-container');

    // Создаем ввод для количества
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.style.width = '50px';
    quantityInput.name = 'kol-vo';
    quantityInput.value = 1;
    quantityInput.className = 'form-control';
    quantityInput.id = 'id_kol-vo';
    quantityInput.setAttribute('data-select2-id', 'id_kol-vo');

    quantityInput.addEventListener('input', (event) =>
                                handleQuantityInputChange(optionText, event));

    // Создаем кнопку "Удалить" для строки
    var deleteButton = document.createElement('input');
    deleteButton.type = 'image';
    deleteButton.src = '/static/admin/img/icon-deletelink.svg';
    deleteButton.alt = 'Удалить';
    deleteButton.title = 'Удалить';
    deleteButton.style = 'width: 15px; height: 15px; margin-top: -10px;';
    // Привязываем обработчик события для кнопки "Удалить"
    deleteButton.addEventListener('click', () => removeTableRow(optionText));

    // Добавляем кнопки в контейнер
    buttonContainer.appendChild(quantityInput);
    buttonContainer.appendChild(deleteButton);
    // Добавляем контейнер в ячейку количества
    cell3.appendChild(buttonContainer);
}


function updateTableRow(optionText, quantity) {
    // Находим строку в таблице с соответствующим наименованием
    const rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 2 && cells[1].textContent === optionText) {
            // Обновляем количество в соответствующей ячейке
            const inputContainer = cells[2].getElementsByClassName(
            'quantity-input-container'
            )[0];
            const quantityInput = inputContainer.getElementsByTagName(
            'input'
            )[0];
            quantityInput.value = quantity;
            return; // Прерываем цикл после обновления
        }
    }
}

function removeTableRow(optionText) {
    delete selectedOptions[optionText];
    // Находим строку в таблице с соответствующим наименованием и удаляем ее
    const rows = tbody.getElementsByTagName('tr');
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 2 && cells[1].textContent === optionText) {
            tbody.removeChild(rows[i]);
            updateSerialNumbers();
            return;
        }
    }
}

function updateSerialNumbers() {
    // Обновляем номера п/п после удаления строки
    const rows = tbody.getElementsByTagName('tr');
    rowCounter = rows.length;
    rowCounter += 1;
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length >= 1) {
            cells[0].textContent = i;
            rowCounter = i + 1;
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    ColorsButton('1')
});