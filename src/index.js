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

app.get("/statement", (req, res) => {
  const { cpf } = req.headers;

  const customer = customers.find(
    (customer) => customer.cpf === cpf
  );

  if(!customer) {
    return res.status(404).json({error: "Account not found!"});
  };

  return res.json(customer.statement);
});

app.listen(3333);