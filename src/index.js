const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const customers = [];

function verifyIfAccountExists(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find(
    (customer) => customer.cpf === cpf
  );

  if(!customer) {
    return res.status(404).json({error: "Account not found!"});
  };

  req.customer = customer;

  return next();
};

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

app.get("/statement", verifyIfAccountExists, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/deposit", verifyIfAccountExists, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  };

  customer.statement.push({
    statementOperation
  });

  return res.status(201).send();
});

app.listen(3333);