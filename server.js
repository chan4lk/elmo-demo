const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const faker = require('faker');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate random dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate pagination metadata
const getPaginationMetadata = (page = 1, itemsPerPage = 20, totalItems) => {
  const lastPage = Math.ceil(totalItems / itemsPerPage);
  return {
    itemsPerPage,
    page,
    totalItems,
    lastPage
  };
};

// Generate dummy data
const generateDummyData = () => {
  const data = {
    departments: [],
    locations: [],
    positions: [],
    users: [],
    onboardingUsers: [],
    employees: [],
    legalEntities: [],
    payrollCycles: [],
    leaveTypes: [],
    leaveRequests: [],
    candidates: []
  };

  // Generate Departments
  const departmentNames = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'Operations', 'IT Support', 'Legal', 'Customer Service', 'Research & Development'];
  for (let i = 0; i < departmentNames.length; i++) {
    data.departments.push({
      id: uuidv4(),
      title: departmentNames[i],
      departmentId: (i + 1).toString(),
      description: `<p>${departmentNames[i]} Department</p>`,
      path: `/${i + 1}/`,
      parent: i > 0 && Math.random() > 0.7 ? data.departments[Math.floor(Math.random() * i)].id : null,
      deleted: false
    });
  }

  // Generate Locations
  const locationNames = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Darwin', 'Hobart', 'Auckland', 'Wellington'];
  for (let i = 0; i < locationNames.length; i++) {
    data.locations.push({
      id: uuidv4(),
      title: locationNames[i],
      locationId: locationNames[i].toUpperCase(),
      description: `${locationNames[i]} Office`,
      addressLine1: faker.address.streetAddress(),
      addressLine2: faker.address.secondaryAddress(),
      suburb: faker.address.city(),
      state: faker.address.state(),
      postcode: faker.address.zipCode(),
      country: 'AU',
      path: `/${i + 1}/`,
      parent: null,
      deleted: false
    });
  }

  // Generate Positions
  const positionTitles = ['Software Engineer', 'Senior Developer', 'Project Manager', 'Business Analyst', 'HR Manager', 'Finance Director', 'Marketing Specialist', 'Sales Representative', 'Operations Manager', 'Legal Counsel'];
  for (let i = 0; i < positionTitles.length; i++) {
    data.positions.push({
      id: uuidv4(),
      title: positionTitles[i],
      positionId: (1000 + i).toString(),
      description: `${positionTitles[i]} role`,
      qualifications: `Bachelor's degree and ${Math.floor(Math.random() * 5) + 1} years experience`,
      parent: null,
      deleted: false
    });
  }

  // Generate Legal Entities
  for (let i = 0; i < 3; i++) {
    data.legalEntities.push({
      id: uuidv4(),
      abn: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
      businessName: faker.company.companyName(),
      tradingName: faker.company.companyName(),
      branchNumber: (i + 1).toString().padStart(2, '0'),
      contactName: faker.name.findName(),
      phone: faker.phone.phoneNumber(),
      fax: faker.phone.phoneNumber(),
      email: faker.internet.email(),
      default: i === 0,
      active: true,
      jurisdiction: 'AU',
      address: {
        addressLine1: faker.address.streetAddress(),
        addressLine2: faker.address.secondaryAddress(),
        suburb: faker.address.city(),
        state: faker.address.state(),
        postcode: faker.address.zipCode(),
        country: 'AU'
      }
    });
  }

  // Generate Payroll Cycles
  const payrollTypes = ['WEEKLY', 'FORTNIGHTLY', 'FOURWEEKLY', 'MONTHLY'];
  const payrollTitles = ['Weekly', 'Fortnightly', '4 Weekly', 'Monthly'];
  const weeksPerAnnum = [52, 26, 13, 12];

  for (let i = 0; i < payrollTypes.length; i++) {
    data.payrollCycles.push({
      id: uuidv4(),
      title: payrollTitles[i],
      description: `${payrollTitles[i]} payroll cycle`,
      startDate: '01/01/2024',
      type: payrollTypes[i],
      default: i === 1, // Fortnightly as default
      weeksPerAnnum: weeksPerAnnum[i],
      jurisdiction: 'AU'
    });
  }

  // Generate Leave Types
  const leaveTypeData = [
    { title: 'Annual Leave', code: 'AL', accrualType: 'PRO_RATA_ACCRUAL', entitlementType: 'ANNUAL_LEAVE' },
    { title: 'Personal Leave', code: 'PL', accrualType: 'PRO_RATA_ACCRUAL', entitlementType: 'PERSONAL_LEAVE' },
    { title: 'Long Service Leave', code: 'LSL', accrualType: 'PRO_RATA_ACCRUAL', entitlementType: 'LONG_SERVICE_LEAVE' },
    { title: 'Compassionate Leave', code: 'CL', accrualType: 'LIMIT_BASED', entitlementType: null },
    { title: 'Maternity Leave', code: 'ML', accrualType: 'FREE_TEXT', entitlementType: null }
  ];

  for (let leaveType of leaveTypeData) {
    data.leaveTypes.push({
      id: uuidv4(),
      accrualType: leaveType.accrualType,
      title: leaveType.title,
      displayTitle: leaveType.title,
      description: `<p>${leaveType.title} policy details...</p>`,
      code: leaveType.code,
      entitlementType: leaveType.entitlementType,
      deleted: false
    });
  }

  // Generate Users
  for (let i = 0; i < 50; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName).toLowerCase();
    const startDate = randomDate(new Date(2020, 0, 1), new Date(2024, 0, 1));

    data.users.push({
      id: uuidv4(),
      identifier: email,
      firstName,
      lastName,
      preferredFirstName: Math.random() > 0.8 ? faker.name.firstName() : null,
      preferredLastName: null,
      username: email,
      email,
      active: Math.random() > 0.1,
      employeeNumber: (10000 + i).toString(),
      manager: i > 0 && Math.random() > 0.7 ? data.users[Math.floor(Math.random() * Math.min(i, 10))].id : null,
      dateOfBirth: faker.date.between('1960-01-01', '2000-12-31').toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0],
      endDate: Math.random() > 0.9 ? randomDate(startDate, new Date()).toISOString().split('T')[0] : null,
      expiryDate: null,
      timezone: 'Australia/Sydney',
      country: 'Australia',
      state: faker.address.state(),
      role: ['EMPLOYEE', 'MANAGER', 'COMPANY_ADMIN'][Math.floor(Math.random() * 3)],
      mobile: faker.phone.phoneNumber(),
      customData: {
        customField_email: faker.internet.email(),
        customField_drivers_license: faker.random.alphaNumeric(8).toUpperCase()
      },
      position: data.positions[Math.floor(Math.random() * data.positions.length)].id,
      location: data.locations[Math.floor(Math.random() * data.locations.length)].id,
      department: data.departments[Math.floor(Math.random() * data.departments.length)].id,
      legalEntity: data.legalEntities[Math.floor(Math.random() * data.legalEntities.length)].id,
      serviceStartDate: startDate.toISOString().split('T')[0]
    });
  }

  // Generate Onboarding Users
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email(firstName, lastName).toLowerCase();
    const startDate = randomDate(new Date(), new Date(2024, 11, 31));

    data.onboardingUsers.push({
      id: uuidv4(),
      firstName,
      lastName,
      preferredFirstName: null,
      preferredLastName: null,
      email,
      active: true,
      employeeNumber: null,
      manager: data.users[Math.floor(Math.random() * data.users.length)].id,
      dateOfBirth: faker.date.between('1980-01-01', '2000-12-31').toISOString().split('T')[0],
      startDate: startDate.toISOString().split('T')[0],
      endDate: null,
      expiryDate: null,
      timezone: 'Australia/Sydney',
      country: 'Australia',
      state: faker.address.state(),
      role: 'EMPLOYEE',
      mobile: faker.phone.phoneNumber(),
      customData: {},
      position: data.positions[Math.floor(Math.random() * data.positions.length)].id,
      location: data.locations[Math.floor(Math.random() * data.locations.length)].id,
      department: data.departments[Math.floor(Math.random() * data.departments.length)].id,
      legalEntity: data.legalEntities[Math.floor(Math.random() * data.legalEntities.length)].id,
      serviceStartDate: startDate.toISOString().split('T')[0]
    });
  }

  // Generate Employee Employment Details
  for (let user of data.users) {
    data.employees.push({
      id: user.id,
      employmentType: ['FULLTIME', 'PARTTIME', 'CASUAL', 'CONTRACTOR'][Math.floor(Math.random() * 4)],
      unitsPerWeek: (Math.random() * 40 + 10).toFixed(1),
      rate: Math.floor(Math.random() * 100000 + 50000),
      rateType: ['DAILY', 'HOURLY'][Math.floor(Math.random() * 2)],
      terminationDate: user.endDate,
      payCycle: data.payrollCycles[Math.floor(Math.random() * data.payrollCycles.length)].id,
      bankAccounts: {
        bankAccountsAU: [{
          accountName: `${user.firstName} ${user.lastName}`,
          bsb: faker.datatype.number({ min: 100000, max: 999999 }),
          accountNumber: faker.datatype.number({ min: 10000000, max: 999999999 }),
          isPrimary: true,
          rateType: 'AMOUNT',
          value: 1000
        }],
        bankAccountsNZ: null,
        bankAccountsGB: null
      },
      withholdingDetails: {
        withholdingDetailsAU: {
          tfn: faker.datatype.number({ min: 100000000, max: 999999999 }).toString(),
          reasonNoTfn: null,
          primaryEmail: user.email,
          previousSurname: null,
          basisOfPayment: 'Full-time',
          isAustralianResident: true,
          isClaimTaxFreeThreshold: Math.random() > 0.5,
          isClaimPensionerOffset: Math.random() > 0.8,
          isClaimZoneOffset: false,
          isWorkingHolidayMaker: false,
          visaCountry: 'AU',
          hasStlr: Math.random() > 0.7,
          isSeasonalWorker: false,
          isInformationCorrect: true,
          declarationDate: user.startDate,
          declarationDateTimezone: 'Australia/Sydney'
        },
        withholdingDetailsNZ: null,
        withholdingDetailsGB: null
      },
      retirementFundAccounts: {
        retirementFundAccountsAU: {
          superFundName: faker.company.companyName() + ' Super Fund',
          superFundType: 'Employee nominated super fund',
          abn: faker.datatype.number({ min: 10000000000, max: 99999999999 }).toString(),
          membershipNumber: faker.random.alphaNumeric(10),
          accountName: `${user.firstName} ${user.lastName}`,
          usi: faker.random.alphaNumeric(8).toUpperCase(),
          bsb: null,
          accountNumber: null,
          esa: null
        },
        retirementFundAccountsNZ: null,
        retirementFundAccountsGB: null
      },
      terminationDetails: user.endDate ? {
        terminationDate: user.endDate,
        reason: ['Resignation', 'Redundancy', 'End of Contract'][Math.floor(Math.random() * 3)],
        notes: 'Standard termination process completed'
      } : null,
      emergencyContacts: [{
        name: faker.name.findName(),
        relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)],
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email()
      }]
    });
  }

  // Generate Leave Requests
  for (let i = 0; i < 100; i++) {
    const user = data.users[Math.floor(Math.random() * data.users.length)];
    const leaveType = data.leaveTypes[Math.floor(Math.random() * data.leaveTypes.length)];
    const startDate = randomDate(new Date(2024, 0, 1), new Date(2024, 11, 31));
    const endDate = new Date(startDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);

    data.leaveRequests.push({
      id: uuidv4(),
      user: `/users/${user.id}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      createdDate: randomDate(new Date(2024, 0, 1), startDate).toISOString().split('T')[0],
      modifiedDate: randomDate(startDate, new Date()).toISOString().split('T')[0],
      status: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'][Math.floor(Math.random() * 4)],
      hours: Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) * 7.5,
      leaveType: `/leave-types/${leaveType.id}`
    });
  }

  // Generate Candidates
  for (let i = 0; i < 25; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    data.candidates.push({
      id: uuidv4(),
      firstName,
      lastName,
      email: faker.internet.email(firstName, lastName).toLowerCase(),
      homePhone: faker.phone.phoneNumber(),
      mobile: faker.phone.phoneNumber(),
      address: {
        addressLine1: faker.address.streetAddress(),
        suburb: faker.address.city(),
        state: faker.address.state(),
        postcode: faker.address.zipCode(),
        country: 'AU'
      },
      applicationDate: randomDate(new Date(2024, 0, 1), new Date()).toISOString().split('T')[0],
      status: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'][Math.floor(Math.random() * 6)],
      position: data.positions[Math.floor(Math.random() * data.positions.length)].title
    });
  }

  return data;
};

// Generate the dummy data
const dummyData = generateDummyData();

// OAuth Token endpoint
app.post('/oauth/token', (req, res) => {
  const { grant_type, client_id, client_secret } = req.body;

  console.log('grant_type', grant_type);
  console.log('client_id', client_id);
  console.log('client_secret', client_secret);

  if (grant_type !== 'client_credentials' || !client_id || !client_secret) {
    return res.status(400).json({
      error: 'invalid_request',
      error_description: 'Invalid grant_type or missing credentials'
    });
  }

  res.json({
    access_token: 'dummy_access_token_' + Date.now(),
    token_type: 'Bearer',
    expires_in: 1800 // 30 minutes
  });
});

// Departments endpoints
app.get('/core/v1/departments', (req, res) => {
  const { page = 1, itemsPerPage = 20, title, departmentId, description, deleted = false } = req.query;
  let filteredData = dummyData.departments.filter(dept => dept.deleted === (deleted === 'true'));

  if (title) {
    filteredData = filteredData.filter(dept => dept.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (departmentId) {
    filteredData = filteredData.filter(dept => dept.departmentId === departmentId);
  }
  if (description) {
    filteredData = filteredData.filter(dept => dept.description.toLowerCase().includes(description.toLowerCase()));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/departments/:id', (req, res) => {
  const department = dummyData.departments.find(d => d.id === req.params.id);
  if (!department) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Department not found'
    });
  }
  res.json(department);
});

// Locations endpoints
app.get('/core/v1/locations', (req, res) => {
  const { page = 1, itemsPerPage = 20, title, locationId, description, deleted = false } = req.query;
  let filteredData = dummyData.locations.filter(loc => loc.deleted === (deleted === 'true'));

  if (title) {
    filteredData = filteredData.filter(loc => loc.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (locationId) {
    filteredData = filteredData.filter(loc => loc.locationId === locationId);
  }
  if (description) {
    filteredData = filteredData.filter(loc => loc.description.toLowerCase().includes(description.toLowerCase()));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/locations/:id', (req, res) => {
  const location = dummyData.locations.find(l => l.id === req.params.id);
  if (!location) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Location not found'
    });
  }
  res.json(location);
});

// Positions endpoints
app.get('/core/v1/positions', (req, res) => {
  const { page = 1, itemsPerPage = 20, title, positionId, description, deleted = false } = req.query;
  let filteredData = dummyData.positions.filter(pos => pos.deleted === (deleted === 'true'));

  if (title) {
    filteredData = filteredData.filter(pos => pos.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (positionId) {
    filteredData = filteredData.filter(pos => pos.positionId === positionId);
  }
  if (description) {
    filteredData = filteredData.filter(pos => pos.description.toLowerCase().includes(description.toLowerCase()));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/positions/:id', (req, res) => {
  const position = dummyData.positions.find(p => p.id === req.params.id);
  if (!position) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Position not found'
    });
  }
  res.json(position);
});

// Users endpoints
app.get('/core/v1/users', (req, res) => {
  const { page = 1, itemsPerPage = 20, firstName, lastName, email, deleted = false, excludeVendorUsers = false } = req.query;
  let filteredData = dummyData.users.filter(user => user.active !== (deleted === 'true'));

  if (firstName) {
    filteredData = filteredData.filter(user => user.firstName.toLowerCase().includes(firstName.toLowerCase()));
  }
  if (lastName) {
    filteredData = filteredData.filter(user => user.lastName.toLowerCase().includes(lastName.toLowerCase()));
  }
  if (email) {
    filteredData = filteredData.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/users/:id', (req, res) => {
  const user = dummyData.users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'User not found'
    });
  }
  res.json(user);
});

// Onboarding Users endpoints
app.get('/core/v1/onboarding-users', (req, res) => {
  const { page = 1, itemsPerPage = 20, firstName, lastName, email, deleted = false } = req.query;
  let filteredData = dummyData.onboardingUsers.filter(user => user.active !== (deleted === 'true'));

  if (firstName) {
    filteredData = filteredData.filter(user => user.firstName.toLowerCase().includes(firstName.toLowerCase()));
  }
  if (lastName) {
    filteredData = filteredData.filter(user => user.lastName.toLowerCase().includes(lastName.toLowerCase()));
  }
  if (email) {
    filteredData = filteredData.filter(user => user.email.toLowerCase().includes(email.toLowerCase()));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/onboarding-users/:id', (req, res) => {
  const user = dummyData.onboardingUsers.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Onboarding User not found'
    });
  }
  res.json(user);
});

// Employees endpoints
app.get('/core/v1/employees', (req, res) => {
  const { page = 1, itemsPerPage = 20 } = req.query;
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = dummyData.employees.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), dummyData.employees.length)
  });
});

app.get('/core/v1/employees/:id', (req, res) => {
  const employee = dummyData.employees.find(e => e.id === req.params.id);
  if (!employee) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Employee not found'
    });
  }
  res.json(employee);
});

// Legal Entities endpoints
app.get('/core/v1/legal-entities', (req, res) => {
  const { page = 1, itemsPerPage = 20, businessName, tradingName, abn } = req.query;
  let filteredData = [...dummyData.legalEntities];

  if (businessName) {
    filteredData = filteredData.filter(entity => entity.businessName.toLowerCase().includes(businessName.toLowerCase()));
  }
  if (tradingName) {
    filteredData = filteredData.filter(entity => entity.tradingName.toLowerCase().includes(tradingName.toLowerCase()));
  }
  if (abn) {
    filteredData = filteredData.filter(entity => entity.abn.includes(abn));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/legal-entities/:id', (req, res) => {
  const entity = dummyData.legalEntities.find(e => e.id === req.params.id);
  if (!entity) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Legal Entity not found'
    });
  }
  res.json(entity);
});

// Payroll Cycles endpoints
app.get('/core/v1/payroll-cycles', (req, res) => {
  const { page = 1, itemsPerPage = 20, title, description, type } = req.query;
  let filteredData = [...dummyData.payrollCycles];

  if (title) {
    filteredData = filteredData.filter(cycle => cycle.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (description) {
    filteredData = filteredData.filter(cycle => cycle.description.toLowerCase().includes(description.toLowerCase()));
  }
  if (type) {
    filteredData = filteredData.filter(cycle => cycle.type === type);
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/payroll-cycles/:id', (req, res) => {
  const cycle = dummyData.payrollCycles.find(c => c.id === req.params.id);
  if (!cycle) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Payroll Cycle not found'
    });
  }
  res.json(cycle);
});

// Leave Types endpoints
app.get('/core/v1/leave-types', (req, res) => {
  const { page = 1, itemsPerPage = 20, title, accrualType, deleted = false } = req.query;
  let filteredData = dummyData.leaveTypes.filter(type => type.deleted === (deleted === 'true'));

  if (title) {
    filteredData = filteredData.filter(type => type.title.toLowerCase().includes(title.toLowerCase()));
  }
  if (accrualType) {
    filteredData = filteredData.filter(type => type.accrualType === accrualType);
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

app.get('/core/v1/leave-types/:id', (req, res) => {
  const leaveType = dummyData.leaveTypes.find(t => t.id === req.params.id);
  if (!leaveType) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Leave Type not found'
    });
  }
  res.json(leaveType);
});

// Leave Requests endpoints
app.get('/core/v1/leave-requests', (req, res) => {
  const { status, leaveTypeId } = req.query;
  let filteredData = [...dummyData.leaveRequests];

  if (status) {
    filteredData = filteredData.filter(request => request.status === status);
  }
  if (leaveTypeId) {
    filteredData = filteredData.filter(request => request.leaveType.includes(leaveTypeId));
  }

  res.json(filteredData);
});

app.get('/core/v1/leave-requests/:id', (req, res) => {
  const request = dummyData.leaveRequests.find(r => r.id === req.params.id);
  if (!request) {
    return res.status(404).json({
      type: 'https://tools.ietf.org/html/rfc2616#section-10',
      title: 'An error occurred',
      detail: 'Leave Request not found'
    });
  }
  res.json(request);
});

// Candidates endpoints
app.get('/recruitment/v1/candidates', (req, res) => {
  const { page = 1, itemsPerPage = 20, firstName, lastName, email, homePhone, mobile } = req.query;
  let filteredData = [...dummyData.candidates];

  if (firstName) {
    filteredData = filteredData.filter(candidate => candidate.firstName.toLowerCase().includes(firstName.toLowerCase()));
  }
  if (lastName) {
    filteredData = filteredData.filter(candidate => candidate.lastName.toLowerCase().includes(lastName.toLowerCase()));
  }
  if (email) {
    filteredData = filteredData.filter(candidate => candidate.email.toLowerCase().includes(email.toLowerCase()));
  }
  if (homePhone) {
    filteredData = filteredData.filter(candidate => candidate.homePhone.includes(homePhone));
  }
  if (mobile) {
    filteredData = filteredData.filter(candidate => candidate.mobile.includes(mobile));
  }

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  res.json({
    data: paginatedData,
    metadata: getPaginationMetadata(parseInt(page), parseInt(itemsPerPage), filteredData.length)
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    totalRecords: {
      departments: dummyData.departments.length,
      locations: dummyData.locations.length,
      positions: dummyData.positions.length,
      users: dummyData.users.length,
      onboardingUsers: dummyData.onboardingUsers.length,
      employees: dummyData.employees.length,
      legalEntities: dummyData.legalEntities.length,
      payrollCycles: dummyData.payrollCycles.length,
      leaveTypes: dummyData.leaveTypes.length,
      leaveRequests: dummyData.leaveRequests.length,
      candidates: dummyData.candidates.length
    }
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'ELMO Dummy API for Fabric Lakehouse',
    version: '1.0.0',
    endpoints: {
      oauth: 'POST /oauth/token',
      departments: 'GET /core/v1/departments',
      locations: 'GET /core/v1/locations',
      positions: 'GET /core/v1/positions',
      users: 'GET /core/v1/users',
      onboardingUsers: 'GET /core/v1/onboarding-users',
      employees: 'GET /core/v1/employees',
      legalEntities: 'GET /core/v1/legal-entities',
      payrollCycles: 'GET /core/v1/payroll-cycles',
      leaveTypes: 'GET /core/v1/leave-types',
      leaveRequests: 'GET /core/v1/leave-requests',
      candidates: 'GET /recruitment/v1/candidates',
      health: 'GET /health'
    },
    documentation: 'Each endpoint supports pagination with ?page=1&itemsPerPage=20 parameters'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    type: 'https://tools.ietf.org/html/rfc2616#section-10',
    title: 'Internal Server Error',
    detail: 'The server encountered an unexpected condition'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    type: 'https://tools.ietf.org/html/rfc2616#section-10',
    title: 'An error occurred',
    detail: 'Not Found'
  });
});

app.listen(PORT, () => {
  console.log(`ELMO Dummy API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API documentation: http://localhost:${PORT}/`);
});

module.exports = app;
