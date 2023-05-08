import writeXlsxFile from 'write-excel-file'
class Excel {
  constructor (fileName, data) {
    this.fileName = fileName
    this.excelData = data
  }

  // 生成excel的表头
  _createHeader () {
    const header = []
    Object.keys(this.excelData[0]).forEach(item => {
      const headerItem = {}
      headerItem.value = item
      headerItem.fontWeight = 'bold'
      header.push(headerItem)
    })
    return header
  }

  // 处理数据
  _handlerData () {
    const rows = []
    this.excelData.forEach(item => {
      const row = this._handlerRow(item)
      rows.push(row)
    })
    return rows
  }

  // 处理excel中每一行数据
  _handlerRow (excelDataItem) {
    const row = []
    for (const rowKey in excelDataItem) {
      const rowItem = {}
      if (rowKey === 'matchDate') {
        rowItem.type = Date
        rowItem.value = new Date(excelDataItem[rowKey])
        rowItem.format = 'yyyy/mm/dd'
      } else if (rowKey === 'matchGamerList') {
        rowItem.type = String
        rowItem.value = excelDataItem[rowKey].join(',')
      } else {
        rowItem.type = String
        rowItem.value = excelDataItem[rowKey]
      }
      row.push(rowItem)
    }
    return row
  }

  // 导出excel文件
  async exportExcel () {
    const header = this._createHeader()
    const rows = this._handlerData()
    const data = []
    data.push(header)
    rows.forEach(row => {
      data.push(row)
    })
    console.log(data)
    const res = await writeXlsxFile(data, {
      fileName: this.fileName
    })
    return res
  }
}

export const matchExport = (fileName, matchDataList) => {
  const excel = new Excel(fileName, matchDataList)
  const res = excel.exportExcel()
  console.log(res)
}
