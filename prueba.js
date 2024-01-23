const clients = [
    { id: 1, rut: "86620855", name: "DANIEL TORO" },
    { id: 2, rut: "7317855K", name: "NICOLAS DUJOVNE" },
    { id: 3, rut: "73826497", name: "ERNESTO BRICENO" },
    { id: 4, rut: "88587715", name: "JORDAN RODRIGUEZ" },
    { id: 5, rut: "94020190", name: "ALEJANDRO PINTO" },
    { id: 6, rut: "99804238", name: "DENIS RODRIGUEZ" },
  ];
  
  const accounts = [
    { clientId: 6, insuranceId: 1, balance: 15000 },
    { clientId: 1, insuranceId: 3, balance: 18000 },
    { clientId: 5, insuranceId: 3, balance: 135000 },
    { clientId: 2, insuranceId: 2, balance: 5600 },
    { clientId: 3, insuranceId: 1, balance: 23000 },
    { clientId: 5, insuranceId: 2, balance: 15000 },
    { clientId: 3, insuranceId: 3, balance: 45900 },
    { clientId: 2, insuranceId: 3, balance: 19000 },
    { clientId: 4, insuranceId: 3, balance: 51000 },
    { clientId: 5, insuranceId: 1, balance: 89000 },
    { clientId: 1, insuranceId: 2, balance: 1600 },
    { clientId: 5, insuranceId: 3, balance: 37500 },
    { clientId: 6, insuranceId: 1, balance: 19200 },
    { clientId: 2, insuranceId: 3, balance: 10000 },
    { clientId: 3, insuranceId: 2, balance: 5400 },
    { clientId: 3, insuranceId: 1, balance: 9000 },
    { clientId: 4, insuranceId: 3, balance: 13500 },
    { clientId: 2, insuranceId: 1, balance: 38200 },
    { clientId: 5, insuranceId: 2, balance: 17000 },
    { clientId: 1, insuranceId: 3, balance: 1000 },
    { clientId: 5, insuranceId: 2, balance: 600 },
    { clientId: 6, insuranceId: 1, balance: 16200 },
    { clientId: 2, insuranceId: 2, balance: 10000 },
  ];
  
  const insurances = [
    { id: 1, name: "SEGURO APV" },
    { id: 2, name: "SEGURO DE VIDA" },
    { id: 3, name: "SEGURO COMPLEMENTARIO DE SALUD" },
  ];

  /* 0.- EJEMPLO: Arreglo con los ids de clientes */
function listClientsIds() {
    /* CODE HERE */
    return clients.map((client) => client.id);
  }
/* 1.- Arreglo con los ids de clientes ordenados por rut */
function listClientsIdsSortedByRUT() {
  const sortedClientIds = clients
    .slice()
    .sort((a, b) => {
      const rutA = a.rut.toUpperCase(); 
      const rutB = b.rut.toUpperCase();

      const numA = rutA.endsWith('K') ? parseInt(rutA.slice(0, -1)) * 10 : parseInt(rutA);
      const numB = rutB.endsWith('K') ? parseInt(rutB.slice(0, -1)) * 10 : parseInt(rutB);

      return numA - numB;
    })
    .map((client) => client.id);

  return sortedClientIds;
}

/* 2.- Arreglo con los nombres de cliente ordenados de mayor a menor por la suma TOTAL de los saldos de cada cliente en los seguros que participa. */
function sortClientsTotalBalances(newClient, newAccount) {
  const clientTotalBalances = {};
  
  if (newClient == null && newAccount == null) {
    newClient = clients
    newAccount = accounts
  }
  
  newAccount.forEach((account) => {
    const { clientId, balance } = account;
    if (clientTotalBalances[clientId] === undefined) {
      clientTotalBalances[clientId] = 0;
    }
    clientTotalBalances[clientId] += balance;
    
  });

  const sortedClients = newClient.sort((a, b) => {
    const balanceA = clientTotalBalances[a.id] || 0;
    const balanceB = clientTotalBalances[b.id] || 0;
    return balanceB - balanceA;
  });

  const sortedClientNames = sortedClients.map((client) => client.name);

  return sortedClientNames;
}


/* 3.- Objeto en que las claves sean los nombres de los seguros y los valores un arreglo con los ruts de sus clientes ordenados alfabeticamente por nombre. */
function insuranceClientsByRUT() {
  const resultObject = {};

  insurances.forEach((insurance) => {
    const { id, name } = insurance;

    const accountsForInsurance = accounts.filter((account) => account.insuranceId === id);

    
    const clientsForInsurance = accountsForInsurance.map((account) => {
      const client = clients.find((c) => c.id === account.clientId);
      return { rut: client.rut, name: client.name };
    });

    clientsForInsurance.sort((a, b) => a.name.localeCompare(b.name));

    const sortedRuts = clientsForInsurance.map((client) => client.rut);
    resultObject[name] = sortedRuts;
  });

  return resultObject;
}


/* 4.- Arreglo ordenado decrecientemente con los saldos de clientes que tengan más de 30.000 en el "Seguro APV" */
function higherClientsBalances() {
  
  const filteredAccounts = accounts.filter(
    (account) =>
      account.balance > 30000 &&
      insurances.find((insurance) => insurance.id === account.insuranceId)?.name === "SEGURO APV"
  );
 
  const balances = filteredAccounts.map((account) => account.balance);

  const sortedBalances = balances.sort((a, b) => b - a);

  return sortedBalances;
}


/* 5.- Arreglo con ids de los seguros ordenados crecientemente por la cantidad TOTAL de dinero que administran. */
function insuranceSortedByHighestBalance() {
  const insuranceBalances = {};


  accounts.forEach((account) => {
    const { insuranceId, balance } = account;
    if (insuranceBalances[insuranceId] === undefined) {
      insuranceBalances[insuranceId] = 0;
    }
    insuranceBalances[insuranceId] += balance;
  });

  const insuranceArray = Object.keys(insuranceBalances).map((insuranceId) => ({
    id: parseInt(insuranceId),
    totalBalance: insuranceBalances[insuranceId],
  }));

  const sortedInsuranceArray = insuranceArray.sort((a, b) => a.totalBalance - b.totalBalance);


  const sortedInsuranceIds = sortedInsuranceArray.map((insurance) => insurance.id);

  return sortedInsuranceIds;
}


/* 6.- Objeto en que las claves sean los nombres de los Seguros y los valores el número de clientes que solo tengan cuentas en ese seguro. */
function uniqueInsurance() {
  const clientsPerInsurance = {};


  accounts.forEach((account) => {
    const { clientId, insuranceId } = account;
    
    if (clientsPerInsurance[insuranceId] === undefined) {
      clientsPerInsurance[insuranceId] = new Set();
    }

    clientsPerInsurance[insuranceId].add(clientId);
  });

  const uniqueClientsPerInsurance = {};
  Object.keys(clientsPerInsurance).forEach((insuranceId) => {
    const clientsSet = clientsPerInsurance[insuranceId];
    uniqueClientsPerInsurance[insuranceId] = clientsSet.size;
  });

  const resultObject = {};
  insurances.forEach((insurance) => {
    const { id, name } = insurance;
    resultObject[name] = uniqueClientsPerInsurance[id] || 0;
  });

  return resultObject;
}


/* 7.- Objeto en que las claves sean los nombres de los Seguros y los valores el id de su cliente con menos fondos. */
function clientWithLessFunds() {
  const clientMinFunds = {};

  accounts.forEach((account) => {
    const { clientId, insuranceId, balance } = account;

    if (clientMinFunds[insuranceId] === undefined || balance < clientMinFunds[insuranceId].balance) {
      clientMinFunds[insuranceId] = { clientId, balance };
    }
  });

  const resultObject = {};
  insurances.forEach((insurance) => {
    const { id, name } = insurance;
    const minFundsInfo = clientMinFunds[id];
    
    if (minFundsInfo) {
      resultObject[name] = minFundsInfo.clientId;
    }
  });

  return resultObject;
}

function newClientRanking() {
 
  const newClients = [...clients];
  const newAccounts = [...accounts];

 
  const newClientId = newClients.length + 1;
  const newClient = { id: newClientId, rut: "12345678", name: "SEBASTIAN KLEIN" };
  newClients.push(newClient);
 
  const newAccount = {
    clientId: newClientId,
    insuranceId: 3, 
    balance: 15000,
  };
  newAccounts.push(newAccount);

  const ranking = sortClientsTotalBalances(newClients, newAccounts);
  
  return ranking
}

  
/* Impresión de soluciones. No modificar. */
console.log("--------------- Start Pregunta 0 ---------------");
console.log(listClientsIds());
console.log("--------------- End Pregunta 0 ---------------");
console.log("--------------- Start Pregunta 1 ---------------");
console.log(listClientsIdsSortedByRUT());
console.log("--------------- End Pregunta 1 ---------------");
console.log("--------------- Start Pregunta 2 ---------------");
console.log(sortClientsTotalBalances());
console.log("--------------- End Pregunta 2 ---------------");
console.log("--------------- Start Pregunta 3 ---------------");
console.log(insuranceClientsByRUT());
console.log("--------------- End Pregunta 3 ---------------");
console.log("--------------- Start Pregunta 4 ---------------");
console.log(higherClientsBalances());
console.log("--------------- End Pregunta 4 ---------------");
console.log("--------------- Start Pregunta 5 ---------------");
console.log(insuranceSortedByHighestBalance());
console.log("--------------- End Pregunta 5 ---------------");
console.log("--------------- Start Pregunta 6 ---------------");
console.log(uniqueInsurance());
console.log("--------------- End Pregunta 6 ---------------");
console.log("--------------- Start Pregunta 7 ---------------");
console.log(clientWithLessFunds());
console.log("--------------- End Pregunta 7 ---------------");
console.log("--------------- Start Pregunta 8 ---------------");
console.log(newClientRanking());
console.log("--------------- End Pregunta 8 ---------------");
