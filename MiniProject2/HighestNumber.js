// Function to find highest marks
function findHighest(marks) {
    let highest = marks[0]; // assume first element is highest
    for (let i = 1; i < marks.length; i++) {
        if (marks[i] > highest) {
            highest = marks[i];
        }
    }
    return highest;
}

// Example usage
let marks = [45, 78, 90, 67, 88];
console.log("Marks:", marks);

let highest = findHighest(marks);
console.log("Highest Marks:", highest);
