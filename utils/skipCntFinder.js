module.exports = (pageNo, numOfRows) => {
    pageNo = parseInt(pageNo)
    numOfRows = parseInt(numOfRows)
    return {
        skip: (pageNo - 1) * numOfRows,
        cnt: numOfRows,
    }
}