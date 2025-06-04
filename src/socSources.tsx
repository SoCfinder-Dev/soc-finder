// Soc sources names, in the order that they appear on the excel file
export const providerNames = [
  "CLP",
  "REACH SVHC",
  "REACH Restricties",
  "KRW",
  "OSPAR",
  "EU-POP Regulation",
];

export function filterCasIntoSoc(workbook) {
  let socs = new Map();
  for (let i = 1; i < workbook.Sheets.Sheet1["!data"].length; i++) {
    // filter everything that is not a CAS number on the first col of
    // the spreadsheet
    if (!isNaN(parseInt(workbook.Sheets.Sheet1["!data"][i][0].v.charAt(0)))) {
      const sources = [];
      // if the associated column contains "Ja", then we know it is the cas source
      for (let j = 0; j < providerNames.length; j++) {
        if (
          workbook.Sheets.Sheet1["!data"][i][j + 4].v.toLowerCase() === "ja"
        ) {
          sources.push(j);
        }
      }
      socs.set(workbook.Sheets.Sheet1["!data"][i][0].v, sources);
    }
  }
  return socs;
}
