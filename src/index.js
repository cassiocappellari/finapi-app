const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

app.post("/account", (req, res) => {
  const { 
    cpf,
    name,
  } = req.body;

  const cpfAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if(cpfAlreadyExists) {
    return res.status(400).json({error: "CPF already exists!"});
  };

  customers.push({
    id: uuidv4(),
    name,
    cpf,
    statement: []
  });

  return res.status(201).send();
});

app.listen(3333);