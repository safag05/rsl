let data = new Array();

fetch("https://spreadsheets.google.com/feeds/cells/1xECb76svbOmFzPwz9PUP001Mwg38PSxu5NZ7-Kft7rw/1/public/full?alt=json")
    .then(function(data_answer) {
        data_answer.json()
            .then(function(data_json) {
                let array_row = 1;
                let row_content = [];

                content_data = data_json.feed.entry;

                // finds the contetent data ant pushes it into data array
                for (let i = 0; i < content_data.length; i++) {
                    if (array_row == content_data[i].gs$cell.row) {
                        row_content.push(content_data[i].content.$t);
                        if (i == content_data.length - 1) {
                            data.push(row_content);
                        }
                    } else {
                        data.push(row_content);
                        array_row = content_data[i].gs$cell.row;
                        row_content = [];
                        row_content.push(content_data[i].content.$t);
                    }
                }

                // console.log(data);
                generateTable(data);

            });
    })
    .catch(function(err) {
        console.log(err);
    });


function generateTable(data) {

    //Create a HTML Table element.
    var table = document.createElement("TABLE");
    table.border = "1";

    //Get the count of columns.
    var columnCount = data[0].length;

    //Add the header row.
    var row = table.insertRow(-1);
    for (var i = 0; i < columnCount; i++) {
        var headerCell = document.createElement("TH");
        headerCell.innerHTML = data[0][i];
        row.appendChild(headerCell);
    }

    //Add the data rows.
    for (var i = 1; i < data.length; i++) {
        row = table.insertRow(-1);
        for (var j = 0; j < columnCount; j++) {
            var cell = row.insertCell(-1);
            cell.innerHTML = data[i][j];
        }
    }

    var dvTable = document.getElementById("dvTable");
    dvTable.innerHTML = "";
    dvTable.appendChild(table);
}