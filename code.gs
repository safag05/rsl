/*
# CREATED BY: BPWEBS.COM
# URL: https://www.bpwebs.com
*/

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate();
}

//GET DATA FROM GOOGLE SHEET AND RETURN AS AN ARRAY
function getData() {
  var spreadSheetId = "1xECb76svbOmFzPwz9PUP001Mwg38PSxu5NZ7-Kft7rw"; //CHANGE
  var dataRange = "Sheet1!A2:J"; //CHANGE

  var range = Sheets.Spreadsheets.Values.get(spreadSheetId, dataRange);
  var values = range.values;

  return values;
}

//INCLUDE JAVASCRIPT AND CSS FILES
//REF: https://developers.google.com/apps-script/guides/html/best-practices#separate_html_css_and_javascript

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}

//Ref: https://datatables.net/forums/discussion/comment/145428/#Comment_145428
//Ref: https://datatables.net/examples/styling/bootstrap4