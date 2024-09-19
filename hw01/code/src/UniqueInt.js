#!/usr/local/bin/node


const fs = require('fs');
const path = require('path');


class UniqueInt {
    // Method to process the input file and generate output file
    processFile(inputFilePath, outputFilePath) {
        // Read input file
        let fileContent = fs.readFileSync(inputFilePath, 'utf8');
        let lines = fileContent.split('\n');

        // Initialize an array to track unique integers (-1023 to 1023)
        let seenIntegers = new Array(2047).fill(false); // Array of 2047 elements (to track integers from -1023 to 1023)
        
        // Process each line
        for (let line of lines) {
            let number = this.readNextItemFromFile(line);
            if (number !== null && number >= -1023 && number <= 1023) {
                seenIntegers[number + 1023] = true; // Map -1023 to index 0, 1023 to index 2046
            }
        }

        // Collect unique integers
        let uniqueIntegers = [];
        for (let i = 0; i < seenIntegers.length; i++) {
            if (seenIntegers[i]) {
                uniqueIntegers.push(i - 1023); // Map back to the actual integer
            }
        }

        // Sort the integers manually
        this.sortUniqueIntegers(uniqueIntegers);

        // Write the output to file
        this.writeResultToFile(outputFilePath, uniqueIntegers);
    }

    // Method to read the next valid integer from a line
    readNextItemFromFile(line) {
        line = line.trim(); // Trim whitespace from the line

        // Check if the line is empty or has non-numeric content
        if (!line || /\s/.test(line.trim())) {
            return null; // Skip empty or multi-integer lines
        }

        try {
            let number = parseInt(line, 10);
            if (isNaN(number)) {
                return null; // Skip non-integer inputs
            }
            return number;
        } catch (e) {
            return null; // Skip lines that cannot be parsed
        }
    }

    // Method to manually sort the unique integers (Selection Sort)
    sortUniqueIntegers(arr) {
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            // Swap the found minimum element with the first element
            let temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;
        }
    }

    // Method to write the sorted integers to the output file
    writeResultToFile(outputFilePath, uniqueIntegers) {
        let outputContent = uniqueIntegers.join('\n');
        fs.writeFileSync(outputFilePath, outputContent, 'utf8');
    }
}

// Example to test with
const inputDir = '../../sample_inputs/';
const outputDir = '../../sample_results/';
const sampleFileName = 'sample_03.txt';
const resultFileName = sampleFileName + '_results.txt';

const uniqueIntProcessor = new UniqueInt();
uniqueIntProcessor.processFile(
    path.join(inputDir, sampleFileName), 
    path.join(outputDir, resultFileName)
);

console.log('Processing complete! 😍 👍');
