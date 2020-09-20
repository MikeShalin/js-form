const express = require('express')
const app = express()
const port = 3000

app.use(express.static('dist'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const female = ['Olivia', 'Ava', 'Amelia', 'Emily', 'Jessica', 'Isla', 'Isabella', 'Poppy', 'Mia', 'Sophie', 'Lily', 'Ruby', 'Evie', 'Grace', 'Ella', 'Sophia', 'Chloe', 'Scarlett', 'Freya', 'Isabelle', 'Phoebe', 'Alice', 'Ellie', 'Bethany', 'Maryam', 'Heidi', 'Paige', 'Faith', 'Rose', 'Ivy', 'Florence', 'Hurriet', 'Maddison', 'Zoe'];
const male = ['Samuel', 'Jack', 'Joseph', 'Harry', 'Alfie', 'Jacob', 'Thomas', 'Charlie', 'Oscar', 'James', 'William', 'Joshua', 'George', 'Ethan', 'Noah', 'Archie', 'Henry', 'Leo', 'John', 'Oliver', 'David', 'Ryan', 'Dexter', 'Connor', 'Albert', 'Austin', 'Stanley', 'Theodore', 'Owen', 'Caleb'];

app.post('/female', function (req, res) {
  res.send(female);
});

app.post('/male', function (req, res) {
  res.send(male);
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
