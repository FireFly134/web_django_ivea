// Функция вызывается по нажатию кнопки сохранить изменения и сортирует колонки по номеру пп
document.addEventListener("DOMContentLoaded", function() {
    const sortButton = document.getElementById("save_btn");

    sortButton.addEventListener("click", function() {
		const table = document.getElementById("myTable");
	    const tbody = table.querySelector("tbody");
	    const rows = Array.from(tbody.querySelectorAll("tr"));
        rows.sort((a, b) => {
            const aInput = a.querySelector(".date-input-npp");
            const bInput = b.querySelector(".date-input-npp");
            if (aInput && bInput) {
                const aNpp = parseInt(aInput.value);
                const bNpp = parseInt(bInput.value);
                return aNpp - bNpp;
            }
            return 0;
        });

        rows.forEach(row => row.remove());
        rows.forEach(row => tbody.appendChild(row));
	});
});