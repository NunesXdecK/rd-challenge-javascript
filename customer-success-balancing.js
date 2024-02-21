function validateCustomerSuccess({ id, score }) {
  if (id === null) throw new Error("No id");
  if (score === null) throw new Error("No score");
  if (id <= 0 || id > 999) throw new Error("Id is not between 1 and 999");
  if (score <= 0 || score > 9999)
    throw new Error("Score is not between 1 and 9999");
}

function validateCustomer({ id, score }) {
  if (id === null) throw new Error("No id");
  if (score === null) throw new Error("No score");
  if (id <= 0 || id > 999999) throw new Error("Id is not between 1 and 999999");
  if (score <= 0 || score > 99999)
    throw new Error("Score is not between 1 and 99999");
}

function validAwayCustomerSuccess(customerSuccess, customerSuccessAway) {
  const maxCustomerSuccessAway = Math.floor(customerSuccess.length / 2);
  if (maxCustomerSuccessAway < customerSuccessAway.length)
    throw new Error("customerSuccessAway more than allowed");
}

function filterAway(customerSuccessList, customerSuccessAway) {
  return customerSuccessList.filter(
    (customerSuccess) => !customerSuccessAway.includes(customerSuccess.id)
  );
}

function hasDuplicatesScores(customerSuccessList) {
  const scores = customerSuccessList?.map(
    (customerSuccess) => customerSuccess.score
  );
  const hasDuplates =
    scores.filter((score, index) => scores.includes(score, index + 1)).length >
    0;
  if (hasDuplates)
    throw new Error("There is customerSuccess with equal scores");
}

function validateCustomersSuccess(customerSuccessList) {
  const customerSuccessLength = customerSuccessList?.length;
  if (customerSuccessLength === 0 || customerSuccessLength > 999)
    throw new Error("customerSuccess is not between 1 and 999");
  hasDuplicatesScores(customerSuccessList);
  customerSuccessList.forEach((customerSuccess) => {
    validateCustomerSuccess(customerSuccess);
  });
}

function validateCustomers(customerList) {
  const customerLength = customerList?.length;
  if (customerLength === 0 || customerLength > 999999)
    throw new Error("customer is not between 1 and 999999");
  customerList.forEach((customer) => validateCustomer(customer));
}

function sortCustomersSuccessByScoreAsc(customerSuccessList) {
  return customerSuccessList.sort(
    (customerSuccessA, customerSuccessB) =>
      customerSuccessA?.score - customerSuccessB?.score
  );
}

function balanceCustomersSuccess(customerSuccessList, customers) {
  return customerSuccessList?.map((customerSuccess) => {
    let services = 0;
    for (let i = customers.length - 1; i >= 0; i--) {
      const customer = customers[i];
      if (customer.score <= customerSuccess.score) {
        customers.splice(i, 1);
        services++;
      }
    }
    return {
      ...customerSuccess,
      services,
    };
  });
}

function sortCustomersSuccessByServicesDesc(customerSuccessList) {
  return customerSuccessList.sort(
    (customerSuccessA, customerSuccessB) =>
      customerSuccessB?.services - customerSuccessA?.services
  );
}

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  validAwayCustomerSuccess(customerSuccess, customerSuccessAway);
  const presentCustomerSucess = filterAway(
    customerSuccess,
    customerSuccessAway
  );
  if (presentCustomerSucess.length === 1) return presentCustomerSucess?.[0]?.id;
  validateCustomersSuccess(presentCustomerSucess);
  validateCustomers(customers);
  const customerSuccessReady = sortCustomersSuccessByScoreAsc(
    presentCustomerSucess
  );
  const balancedCustomerSuccess = balanceCustomersSuccess(
    customerSuccessReady,
    customers
  );
  const [first, second] = sortCustomersSuccessByServicesDesc(
    balancedCustomerSuccess
  );
  return first?.services === second?.services ? 0 : first?.id;
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});

test("Scenario 8", () => {
  const css = mapEntities([60, 40, 95, 75]);
  const customers = mapEntities([90, 70, 20, 40, 60, 10]);
  const csAway = [2, 4];
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

// testes adicionais das premissas
test("Scenario 9, it should throw error when customerSuccess have same score", () => {
  const customerSuccess = [
    { id: 1, score: 20 },
    { id: 2, score: 20 },
  ];

  expect(() => hasDuplicatesScores(customerSuccess)).toThrowError(
    "There is customerSuccess with equal scores"
  );
});

test("Scenario 10, it should throw error when customerSuccess have invalid quantity by lower than 1", () => {
  const customerSuccess = [];

  expect(() => validateCustomersSuccess(customerSuccess)).toThrowError(
    "customerSuccess is not between 1 and 999"
  );
});

test("Scenario 11, it should throw error when customerSuccess have invalid quantity by higher than 999", () => {
  const customerSuccess = mapEntities(arraySeq(1000, 1));

  expect(() => validateCustomersSuccess(customerSuccess)).toThrowError(
    "customerSuccess is not between 1 and 999"
  );
});

test("Scenario 12, it should throw error when customer have invalid quantity by lower than 1", () => {
  const customers = [];

  expect(() => validateCustomers(customers)).toThrowError(
    "customer is not between 1 and 999999"
  );
});

test("Scenario 13, it should throw error when customer have invalid quantity by higher than 999999", () => {
  let customers = [];
  customers.length = 1000000;
  
  expect(() => validateCustomers(customers)).toThrowError(
    "customer is not between 1 and 999999"
  );
});

test("Scenario 14, it should throw error when customerSuccess have invalid id by lower than 1", () => {
  const customerSuccess = { id: 0, score: 20 };

  expect(() => validateCustomerSuccess(customerSuccess)).toThrowError(
    "Id is not between 1 and 999"
  );
});

test("Scenario 15, it should throw error when customerSuccess have invalid id by higher than 999", () => {
  const customerSuccess = { id: 1000, score: 20 };

  expect(() => validateCustomerSuccess(customerSuccess)).toThrowError(
    "Id is not between 1 and 999"
  );
});

test("Scenario 16, it should throw error when customer have invalid id by lower than 1", () => {
  const customer = { id: 0, score: 20 };

  expect(() => validateCustomer(customer)).toThrowError(
    "Id is not between 1 and 9999"
  );
});

test("Scenario 17, it should throw error when customer have invalid id by higher than 999999", () => {
  const customer = { id: 1000000, score: 20 };

  expect(() => validateCustomer(customer)).toThrowError(
    "Id is not between 1 and 999999"
  );
});

test("Scenario 18, it should throw error when customerSuccess have invalid score by lower than 1", () => {
  const customerSuccess = { id: 1, score: 0 };

  expect(() => validateCustomerSuccess(customerSuccess)).toThrowError(
    "Score is not between 1 and 9999"
  );
});

test("Scenario 19, it should throw error when customerSuccess have invalid score by higher than 9999", () => {
  const customerSuccess = { id: 1, score: 10000 };

  expect(() => validateCustomerSuccess(customerSuccess)).toThrowError(
    "Score is not between 1 and 9999"
  );
});

test("Scenario 20, it should throw error when customer have invalid score by lower than 1", () => {
  const customer = { id: 2, score: 0 };

  expect(() => validateCustomer(customer)).toThrowError(
    "Score is not between 1 and 99999"
  );
});

test("Scenario 21, it should throw error when customer have invalid score by higher than 99999", () => {
  const customer = { id: 2, score: 100000 };

  expect(() => validateCustomer(customer)).toThrowError(
    "Score is not between 1 and 99999"
  );
});

test("Scenario 22, it should throw error when customerSuccessAway is higher than allowed", () => {
  const customerSuccess = [
    { id: 1, score: 10 },
    { id: 2, score: 20 },
    { id: 3, score: 30 },
  ];
  const csAway = [1, 3];

  expect(() => validAwayCustomerSuccess(customerSuccess, csAway)).toThrowError(
    "customerSuccessAway more than allowed"
  );
});

test("Scenario 23, it should display the only customerSuccess avaliable", () => {
  const customerSuccess = [{ id: 2, score: 20 }];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [];

  expect(customerSuccessBalancing(customerSuccess, customers, csAway)).toEqual(
    2
  );
});
