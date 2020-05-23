const XLSX = require("xlsx")

class Exels {

    /**
     * Read Exel File From Path
     */
    readFile = (path = null) => {
        const workBook = XLSX.readFile(path)
        let sheetNames = workBook.SheetNames
        console.log(XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]))
    }
}
module.exports = new Exels()