//созадем переменные для индексов столбцов
var id_index = -1;
var num_pp_index = -1;
var date_pp_index = -1;
var payment_index = -1;
//сквозная нумерация новых элементов
var k = 0
var dict_k = {}

function remove_dop_pp(id_elements) {
    var num_pp_to_remove = document.getElementById("dop_num_pp_new" + id_elements);
    var date_pp_to_remove = document.getElementById("dop_date_pp_new" + id_elements);
    var payment_to_remove = document.getElementById("dop_payment_new" + id_elements);
    var del_but_to_remove = document.getElementById("dop_del_but" + id_elements);
    if (num_pp_to_remove) {
        num_pp_to_remove.remove();
    };
    if (date_pp_to_remove) {
        date_pp_to_remove.remove();
    };
    if (payment_to_remove) {
        payment_to_remove.remove();
    };
    if (del_but_to_remove) {
        del_but_to_remove.remove();
    };
    if (dict_k[id_elements]){
        delete dict_k[id_elements];
    };
}
function add_dop_pp(id_doc_date){
    // Берем в переменную элементы таблицы "myTable"
    var table = document.getElementById("myTable");
    var tr = table.getElementsByTagName("tr");
    var td;

    // Если индексы стоят по дефолту, то ищем их
    if (id_index === -1 && num_pp_index === -1 && date_pp_index === -1 && payment_index === -1){
        // Находим заголовочную строку таблицы (первую строку)
        var headerRow = tr[0];
        td = headerRow.getElementsByTagName("td");

        // Ищем индексы столбцов, соответствующих поиску

        for (var j = 0; j < td.length; j++) {
            var headerText = td[j].textContent || td[j].innerText;
            if (headerText.trim() === "ID") {
                window.id_index = j;
            };
            if (headerText.trim() === "Номер п/п") {
                window.num_pp_index = j;
            };
            if (headerText.trim() === "Дата п/п") {
                window.date_pp_index = j;
            };
            if (headerText.trim() === "Оплачено/Закрыто") {
                window.payment_index = j;
            };
        };
    };
    for (var i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        var id = td[id_index].textContent || td[id_index].innerText;
        if (id_doc_date === id.trim()){
            k++
            var num_pp_input = document.createElement("input");
            num_pp_input.name = "dop_num_pp_new" + k;
            num_pp_input.id = "dop_num_pp_new" + k;
            num_pp_input.type = "text";
            num_pp_input.className = "date-input";
            num_pp_input.style.width = "185px";
            var date_pp_input = document.createElement("input");
            date_pp_input.name = "dop_date_pp_new" + k;
            date_pp_input.id = "dop_date_pp_new" + k;
            date_pp_input.type = "date";
            date_pp_input.className = "date-input";
            date_pp_input.style.width = "105px";
            var payment_input = document.createElement("input");
            payment_input.name = "dop_payment_new" + k;
            payment_input.id = "dop_payment_new" + k;
            payment_input.type = "text";
            payment_input.className = "date-input";
            payment_input.style.width = "100px";
            var del_but = document.createElement("input");
            del_but.id = "dop_del_but" + k;
            del_but.type = "image";
            del_but.src = "/static/admin/img/icon-deletelink.svg";
            del_but.alt = "Удалить";
            del_but.title = "Удалить";

            del_but.style.width = "15px";
            del_but.style.height = "15px";
            del_but.style.marginTop = "-10px";
            del_but.setAttribute("data-element-number", k);
            del_but.onclick = function() {
                                            remove_dop_pp(event.target.getAttribute("data-element-number"));
                                            return false;
                                         };
            // Добавляем новые элементы к соответствующим td
            td[num_pp_index].appendChild(num_pp_input);
            td[num_pp_index].appendChild(del_but);
            td[date_pp_index].appendChild(date_pp_input);
            td[payment_index].appendChild(payment_input);
            dict_k[k]=id_doc_date
            // Сериализуем объект в строку JSON
            var jsonString = JSON.stringify(dict_k);
            // Обновляем значение скрытого поля
            document.getElementById('dict_new_elements').value = jsonString;
        };
    };
};