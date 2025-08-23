// Define a student object
const student = {
    name: "blob",
    age: 20,
    major: "cyber security",
    gpa: 9.8, 
    uni: "adypu"
};

// Function to print student details
function printStudentDetails(student) {
    console.log("Student Details:");
    console.log("Name: " + student.name);
    console.log("Age: " + student.age);
    console.log("Major: " + student.major);
    console.log("GPA: " + student.gpa);
    console.log("University: " + student.uni);
}

// Call the function 
printStudentDetails(student);