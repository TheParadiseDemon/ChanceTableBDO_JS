let createTable = (data, idTable) => {
    let table = document.getElementById(idTable);
    let tr = document.createElement("tr");

    for (key in data[0]) {
        let th = document.createElement("th");
        th.innerHTML = key;
        tr.append(th);
    }
    table.append(tr);

    data.forEach((item) => {
        tr = document.createElement("tr");
        for (value in item) {
            let td = document.createElement("td");
            td.innerHTML = item[value];
            tr.append(td);
        }
        table.append(tr);
    });
};

document.addEventListener("DOMContentLoaded", function () {
    createTable(items, "list");
    setSortSelects(items[0], document.getElementById("sort"));

    let searchButton = document.getElementById("search_button");
    searchButton.addEventListener("click", function () {
        let dataForm = document.getElementById("filter");
        filterTable(items, "list", dataForm);
    });

    let clearButton = document.getElementById("clearsearch_button");
    clearButton.addEventListener("click", function(){clearFilter()});

    let SortButton = document.getElementById("sort_button");
    SortButton.addEventListener("click", function () {
        let dataForm = document.getElementById("sort");
        sortTable("list",dataForm)
    });

    let First_Set = document.getElementById("fieldsFirst");
    First_Set.addEventListener("change", function () {
        changeNextSelect("fieldsSecond", First_Set);
    });

    let Second_Set = document.getElementById("fieldsSecond");
    Second_Set.addEventListener("change", function () {
        changeNextSelect("fieldsThird", Second_Set);
    });

    let clearsort = document.getElementById("clearsort_button")
    clearsort.addEventListener("click", function(){
        resetSort("list")
        clearTable("list");
        createTable(items, "list");
    })
});

let dataFilter = (dataForm) => {
    let dictFilter = {};
    for (let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        let valInput = item.value;

        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type == "number") {
            if (valInput !== "") {
                valInput = parseFloat(valInput);
            } else {
                if (item.id.includes("from")) {
                    valInput = Number.NEGATIVE_INFINITY;
                } else if (item.id.includes("to")) {
                    valInput = Number.POSITIVE_INFINITY;
                }
            }
        }
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
};

let filterTable = (data, idTable, dataForm) => {

    let datafilter = dataFilter(dataForm);
    let tableFilter = data.filter((item) => {
        let result = true;
        for (let key in item) {
            let val = item[key];

            if (typeof val == "string") {
                if (key in correspond) {
                    val = item[key].toLowerCase();
                    result &&= val.includes(datafilter[correspond[key]]);
                }
            } else if (typeof val === "number") {
                if (key in correspond)
                    result &&= datafilter[correspond[key][0]] <= val && val <= datafilter[correspond[key][1]];
            }
        }
        return result;
    });
    clearTable(idTable);
    createTable(tableFilter, idTable);
};

let clearFilter = () => {
    document.getElementById("filter").reset();
    clearTable("list");
    createTable(items, "list");
};
function clearTable(idTable) {
    let table = document.getElementById(idTable);
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
}

let createOption = (str, val) => {
    let item = document.createElement("option");
    item.text = str;
    item.value = val;
    return item;
};

let setSortSelect = (head, sortSelect) => {
    sortSelect.append(createOption("Нет", 0));
    for (let i in head) {
        sortSelect.append(createOption(head[i], Number(i) + 1));
    }
};
let setSortSelects = (data, dataForm) => {
    let head = Object.keys(data);
    let allSelect = dataForm.getElementsByTagName("select");
    for (let j = 0; j < allSelect.length; j++) {
        setSortSelect(head, allSelect[j]);
        if (j != 0) {
            allSelect[j].setAttribute("disabled", "disabled");
        }
    }
};

let changeNextSelect = (nextSelectId, curSelect) => {

    let nextSelect = document.getElementById(nextSelectId);
    if (!parseFloat(curSelect.value)) {
        let allselect = document.getElementsByTagName('select')
        let foundCurrent = false;
        for (let i = 0; i < allselect.length; i++) {
            if (foundCurrent) {
                allselect[i].disabled = true;
            } else if (allselect[i] === curSelect) {
                foundCurrent = true;
            }
        }
    } else {
        nextSelect.disabled = false;
        nextSelect.innerHTML = curSelect.innerHTML;
        let selectedOption = curSelect.options[curSelect.selectedIndex];
        for (let i = 0; i < nextSelect.options.length; i++) {
            if (nextSelect.options[i].value === selectedOption.value) {
                nextSelect.remove(i);
                break;
            }
        }
    }
};

let createSortArr = (data) => {

    let sortArr = [];
    let sortSelects = data.getElementsByTagName("select");
    for (let i = 0; i < sortSelects.length; i++) {
        let keySort = sortSelects[i].value;
        if (keySort == 0) {
            break;
        }
        let desc = document.getElementById(sortSelects[i].id + "Desc").checked;
        if(desc==true) sortArr.push({ column: keySort - 1, order: true });
        else sortArr.push({ column: keySort - 1, order: false });
    }
    return sortArr;
};

let sortTable = (idTable, data) => {

    let sortArr = createSortArr(data);
    if (sortArr.length === 0) {
        return false;
    }
    let table = document.getElementById(idTable);
    let rowData = Array.from(table.rows);
    rowData.shift();

    rowData.sort((first, second) => {

        for (let i in sortArr) {
            let key = sortArr[i].column;
            let order = sortArr[i].order ? -1 : 1;
            let a = first.cells[key].innerHTML;
            let b = second.cells[key].innerHTML;
            if (parseFloat(a) && parseFloat(b)){
                a = parseFloat(a);
                b = parseFloat(b);
            }
            if (a > b)
                return 1 * order;
            else if (a < b)
                return -1 * order;
        }
        return 0;
    });

    table.innerHTML = table.rows[0].innerHTML;
    rowData.forEach((item) => {
        table.append(item);
    });
};

let resetSort = (tableid) => {

    let table = document.getElementById(tableid)
    document.getElementById("sort").reset();
    document.getElementById("fieldsSecond").disabled = true;
    document.getElementById("fieldsThird").disabled = true;
}

