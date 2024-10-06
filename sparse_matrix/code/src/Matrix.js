class Node {
    constructor(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
        this.next = null;
    }
}

class SparseMatrix {
    constructor(rows = 0, cols = 0) {
        this.rows = rows;
        this.cols = cols;
        this.head = null;  // head of the linked list storing non-zero elements
    }

    // Add a new element to the linked list
    setElement(row, col, value) {
        if (value === 0) return; // No need to store zero values
        const newNode = new Node(row, col, value);
        if (!this.head) {
            this.head = newNode;
        } else {
            let temp = this.head;
            while (temp.next) temp = temp.next;
            temp.next = newNode;
        }
    }

    // Get the element value at the given row and column
    getElement(row, col) {
        let temp = this.head;
        while (temp) {
            if (temp.row === row && temp.col === col) return temp.value;
            temp = temp.next;
        }
        return 0; // Default value for sparse matrix
    }

    // Load a sparse matrix from a file (represented here as string for simplicity)
    static fromFile(fileContent) {
        const lines = fileContent.trim().split('\n');
        const [rows, cols] = [parseInt(lines[0].split('=')[1]), parseInt(lines[1].split('=')[1])];
        const matrix = new SparseMatrix(rows, cols);

        for (let i = 2; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === "") continue;

            // Parse the tuple
            const match = line.match(/\((\d+),\s*(\d+),\s*(-?\d+)\)/);
            if (!match) throw new Error("Input file has wrong format");

            const [row, col, value] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
            matrix.setElement(row, col, value);
        }
        return matrix;
    }

    // Matrix addition
    add(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrices have different dimensions for addition");
        }

        const result = new SparseMatrix(this.rows, this.cols);
        let tempA = this.head;
        let tempB = other.head;

        while (tempA || tempB) {
            if (!tempB || (tempA && (tempA.row < tempB.row || (tempA.row === tempB.row && tempA.col < tempB.col)))) {
                result.setElement(tempA.row, tempA.col, tempA.value);
                tempA = tempA.next;
            } else if (!tempA || (tempB && (tempB.row < tempA.row || (tempB.row === tempA.row && tempB.col < tempA.col)))) {
                result.setElement(tempB.row, tempB.col, tempB.value);
                tempB = tempB.next;
            } else {
                const sum = tempA.value + tempB.value;
                if (sum !== 0) result.setElement(tempA.row, tempA.col, sum);
                tempA = tempA.next;
                tempB = tempB.next;
            }
        }

        return result;
    }

    // Matrix subtraction
    subtract(other) {
        if (this.rows !== other.rows || this.cols !== other.cols) {
            throw new Error("Matrices have different dimensions for subtraction");
        }

        const result = new SparseMatrix(this.rows, this.cols);
        let tempA = this.head;
        let tempB = other.head;

        while (tempA || tempB) {
            if (!tempB || (tempA && (tempA.row < tempB.row || (tempA.row === tempB.row && tempA.col < tempB.col)))) {
                result.setElement(tempA.row, tempA.col, tempA.value);
                tempA = tempA.next;
            } else if (!tempA || (tempB && (tempB.row < tempA.row || (tempB.row === tempA.row && tempB.col < tempA.col)))) {
                result.setElement(tempB.row, tempB.col, -tempB.value);
                tempB = tempB.next;
            } else {
                const diff = tempA.value - tempB.value;
                if (diff !== 0) result.setElement(tempA.row, tempA.col, diff);
                tempA = tempA.next;
                tempB = tempB.next;
            }
        }

        return result;
    }

    // Matrix multiplication
    multiply(other) {
        if (this.cols !== other.rows) {
            throw new Error("Incompatible matrix dimensions for multiplication");
        }

        const result = new SparseMatrix(this.rows, other.cols);
        let tempA = this.head;

        while (tempA) {
            let tempB = other.head;
            while (tempB) {
                if (tempA.col === tempB.row) {
                    const product = tempA.value * tempB.value;
                    const currentVal = result.getElement(tempA.row, tempB.col);
                    result.setElement(tempA.row, tempB.col, currentVal + product);
                }
                tempB = tempB.next;
            }
            tempA = tempA.next;
        }

        return result;
    }

    // Display the sparse matrix as a list of non-zero elements
    display() {
        let temp = this.head;
        while (temp) {
            console.log(`(${temp.row}, ${temp.col}, ${temp.value})`);
            temp = temp.next;
        }
    }
}

// Sample Usage
const fileA = `rows=3 cols=3
(0, 1, 4)
(1, 2, 3)
(2, 0, 1)`;

const fileB = `rows=3 cols=3
(0, 1, 2)
(1, 2, 1)
(2, 0, 5)`;

// Load matrices from file
const matrixA = SparseMatrix.fromFile(fileA);
const matrixB = SparseMatrix.fromFile(fileB);

// Perform operations
const sum = matrixA.add(matrixB);
const diff = matrixA.subtract(matrixB);
const product = matrixA.multiply(matrixB);

// Display results
console.log("Sum:");
sum.display();
console.log("Difference:");
diff.display();
console.log("Product:");
product.display();
