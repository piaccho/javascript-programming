/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use('AGH');

// Reset collection
db.getCollection('students').deleteMany({});

// Insert a few documents into the students collection.
db.getCollection('students').insertMany([
  { 'firstname': 'Jan', 'secondname': 'Kowalski', 'faculty': 'IET'},
  { 'firstname': 'Kamil', 'secondname': 'Nowak', 'faculty': 'IET'},
  { 'firstname': 'Mateusz', 'secondname': 'Lewandowski', 'faculty': 'IET'},
  { 'firstname': 'Marcin', 'secondname': 'Wójcik', 'faculty': 'IET'},
  { 'firstname': 'Tomasz', 'secondname': 'Król', 'faculty': 'MS'},
  { 'firstname': 'Natalia', 'secondname': 'Kowalska', 'faculty': 'MS'},
  { 'firstname': 'Joanna', 'secondname': 'Tracz', 'faculty': 'MS'},
  { 'firstname': 'Anna', 'secondname': 'Wiśniewska', 'faculty': 'FIS'},
  { 'firstname': 'Stefan', 'secondname': 'Florek', 'faculty': 'FIS'},
]);


db.students.find({'faculty': 'IET'})
db.students.find({'faculty': 'MS'})
db.students.find({'faculty': 'FIS'})

