function generateRandomBinaryMatrix(rows, columns) {
  const matrix = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(Math.random() < 0.5 ? 0 : 1);
    }
    matrix.push(row);
  }
  return matrix;
}

const numRows = 5;
const numColumns = 22;
const binaryMatrix = generateRandomBinaryMatrix(numRows, numColumns);

console.log(binaryMatrix);