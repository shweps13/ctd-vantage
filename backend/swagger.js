module.exports = {
   openapi: '3.0.3',
   info: {
      title: 'Vantage API',
      description: 'Backend API for the Vantage finance app. Auth, balances, and transactions.',
      version: '1.0.0',
   },
   servers: [
      { url: 'http://localhost:4000', description: 'Development' },
      { url: 'https://ctd-vantage.onrender.com', description: 'Production' },
   ],
   components: {
      securitySchemes: {
         bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT from POST /api/v1/auth/login or /register',
         },
      },
      schemas: {
         UserPublic: {
            type: 'object',
            properties: {
               name: { type: 'string', example: 'John Doe' },
            },
         },
         Balance: {
            type: 'object',
            properties: {
               _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
               accountType: {
                  type: 'string',
                  enum: ['Credit Card', 'Checking', 'Savings', 'Investment', 'Loan'],
               },
               bankName: { type: 'string' },
               accountNumber: { type: 'string' },
               balance: { type: 'number' },
               branchName: { type: 'string' },
               user: { type: 'string', description: 'User ID' },
               createdAt: { type: 'string', format: 'date-time' },
               updatedAt: { type: 'string', format: 'date-time' },
            },
         },
         BalanceCreate: {
            type: 'object',
            required: ['accountType', 'bankName', 'accountNumber'],
            properties: {
               accountType: {
                  type: 'string',
                  enum: ['Credit Card', 'Checking', 'Savings', 'Investment', 'Loan'],
               },
               bankName: { type: 'string', maxLength: 20 },
               accountNumber: { type: 'string', maxLength: 16 },
               balance: { type: 'number', default: 0 },
               branchName: { type: 'string', maxLength: 50 },
            },
         },
         Transaction: {
            type: 'object',
            properties: {
               _id: { type: 'string' },
               itemDescription: { type: 'string' },
               shopName: { type: 'string' },
               date: { type: 'string', format: 'date-time' },
               paymentMethod: {
                  type: 'string',
                  enum: ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other'],
               },
               amount: { type: 'number', minimum: 0 },
               transactionType: { type: 'string', enum: ['expense', 'revenue'] },
               user: { type: 'string' },
               balance: { type: 'string', nullable: true },
               createdAt: { type: 'string', format: 'date-time' },
               updatedAt: { type: 'string', format: 'date-time' },
            },
         },
         TransactionCreate: {
            type: 'object',
            required: ['itemDescription', 'shopName', 'paymentMethod', 'amount', 'transactionType'],
            properties: {
               itemDescription: { type: 'string', maxLength: 200 },
               shopName: { type: 'string', maxLength: 100 },
               date: { type: 'string', format: 'date-time' },
               paymentMethod: {
                  type: 'string',
                  enum: ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other'],
               },
               amount: { type: 'number', minimum: 0 },
               transactionType: { type: 'string', enum: ['expense', 'revenue'] },
               balance: { type: 'string', description: 'Balance ID to link transaction to' },
            },
         },
         Error: {
            type: 'object',
            properties: {
               msg: { type: 'string' },
            },
         },
      },
   },
   security: [],
   tags: [
      { name: 'Auth', description: 'Register and login' },
      { name: 'Balances', description: 'User balance accounts' },
      { name: 'Transactions', description: 'User transactions' },
   ],
   paths: {
      '/api/v1/auth/register': {
         post: {
            tags: ['Auth'],
            summary: 'Register a new user',
            requestBody: {
               required: true,
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        required: ['name', 'email', 'password'],
                        properties: {
                           name: { type: 'string', minLength: 3, maxLength: 50 },
                           email: { type: 'string', format: 'email' },
                           password: { type: 'string', minLength: 6 },
                        },
                     },
                  },
               },
            },
            responses: {
               201: {
                  description: 'User created',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              user: { $ref: '#/components/schemas/UserPublic' },
                              token: { type: 'string', description: 'JWT' },
                           },
                        },
                     },
                  },
               },
               400: { description: 'Validation or duplicate email', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
      '/api/v1/auth/login': {
         post: {
            tags: ['Auth'],
            summary: 'Login',
            requestBody: {
               required: true,
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        required: ['email', 'password'],
                        properties: {
                           email: { type: 'string', format: 'email' },
                           password: { type: 'string' },
                        },
                     },
                  },
               },
            },
            responses: {
               200: {
                  description: 'Success',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              user: { $ref: '#/components/schemas/UserPublic' },
                              token: { type: 'string', description: 'JWT' },
                           },
                        },
                     },
                  },
               },
               401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
      '/api/v1/users/{userId}/balances': {
         get: {
            tags: ['Balances'],
            summary: 'List balances',
            security: [{ bearerAuth: [] }],
            parameters: [{
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            }],
            responses: {
               200: {
                  description: 'List of balances',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { balances: { type: 'array', items: { $ref: '#/components/schemas/Balance' } } },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
         post: {
            tags: ['Balances'],
            summary: 'Create a balance',
            security: [{ bearerAuth: [] }],
            parameters: [{
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            }],
            requestBody: {
               required: true,
               content: {
                  'application/json': { schema: { $ref: '#/components/schemas/BalanceCreate' } },
               },
            },
            responses: {
               201: {
                  description: 'Balance created',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { balance: { $ref: '#/components/schemas/Balance' } },
                        },
                     },
                  },
               },
               400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
      '/api/v1/users/{userId}/balances/{balanceId}': {
         get: {
            tags: ['Balances'],
            summary: 'Balance details with paginated transactions',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'balanceId', in: 'path', required: true, schema: { type: 'string' } },
               { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
               { name: 'skip', in: 'query', schema: { type: 'integer', default: 0 } },
            ],
            responses: {
               200: {
                  description: 'Balance and transactions',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              balanceInfo: { $ref: '#/components/schemas/Balance' },
                              transactions: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
                              total: { type: 'integer' },
                              limit: { type: 'integer' },
                              skip: { type: 'integer' },
                           },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Balance not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
      '/api/v1/users/{userId}/balances/{id}': {
         get: {
            tags: ['Balances'],
            summary: 'Get one balance by id',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
               200: {
                  description: 'Balance',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { balance: { $ref: '#/components/schemas/Balance' } },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
         patch: {
            tags: ['Balances'],
            summary: 'Update a balance',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           accountType: { type: 'string', enum: ['Credit Card', 'Checking', 'Savings', 'Investment', 'Loan'] },
                           bankName: { type: 'string' },
                           accountNumber: { type: 'string' },
                           balance: { type: 'number' },
                           branchName: { type: 'string' },
                        },
                     },
                  },
               },
            },
            responses: {
               200: {
                  description: 'Updated balance',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { balance: { $ref: '#/components/schemas/Balance' } },
                        },
                     },
                  },
               },
               400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
         delete: {
            tags: ['Balances'],
            summary: 'Delete a balance',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
               200: {
                  description: 'Balance removed',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { message: { type: 'string', example: 'Balance removed' } },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
      '/api/v1/users/{userId}/transactions': {
         get: {
            tags: ['Transactions'],
            summary: 'List transactions',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'type', in: 'query', schema: { type: 'string', enum: ['expense', 'revenue'] } },
               { name: 'balanceId', in: 'query', schema: { type: 'string' } },
               { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
               { name: 'skip', in: 'query', schema: { type: 'integer', default: 0 } },
            ],
            responses: {
               200: {
                  description: 'Paginated transactions',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              transactions: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
                              total: { type: 'integer' },
                              limit: { type: 'integer' },
                              skip: { type: 'integer' },
                           },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
         post: {
            tags: ['Transactions'],
            summary: 'Create a transaction',
            security: [{ bearerAuth: [] }],
            parameters: [{
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            }],
            requestBody: {
               required: true,
               content: {
                  'application/json': { schema: { $ref: '#/components/schemas/TransactionCreate' } },
               },
            },
            responses: {
               201: {
                  description: 'Transaction created (optionally with updated balance)',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: {
                              transaction: { $ref: '#/components/schemas/Transaction' },
                              balance: { $ref: '#/components/schemas/Balance', description: 'Present when balance was linked' },
                           },
                        },
                     },
                  },
               },
               400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Balance not found when balance id provided', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
      '/api/v1/users/{userId}/transactions/{id}': {
         get: {
            tags: ['Transactions'],
            summary: 'Get one transaction',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
               200: {
                  description: 'Transaction',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { transaction: { $ref: '#/components/schemas/Transaction' } },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
         patch: {
            tags: ['Transactions'],
            summary: 'Update a transaction',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            requestBody: {
               content: {
                  'application/json': {
                     schema: {
                        type: 'object',
                        properties: {
                           itemDescription: { type: 'string' },
                           shopName: { type: 'string' },
                           date: { type: 'string', format: 'date-time' },
                           paymentMethod: { type: 'string', enum: ['Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other'] },
                           amount: { type: 'number', minimum: 0 },
                           transactionType: { type: 'string', enum: ['expense', 'revenue'] },
                           balance: { type: 'string', nullable: true },
                        },
                     },
                  },
               },
            },
            responses: {
               200: {
                  description: 'Updated transaction',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { transaction: { $ref: '#/components/schemas/Transaction' } },
                        },
                     },
                  },
               },
               400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
         delete: {
            tags: ['Transactions'],
            summary: 'Delete a transaction',
            security: [{ bearerAuth: [] }],
            parameters: [
               {
               name: 'userId',
               in: 'path',
               required: true,
               schema: { type: 'string' },
               description: 'Goes from decoded JWT token - https://www.jwt.io/',
            },
               { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
               200: {
                  description: 'Transaction removed',
                  content: {
                     'application/json': {
                        schema: {
                           type: 'object',
                           properties: { message: { type: 'string', example: 'Transaction removed' } },
                        },
                     },
                  },
               },
               401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
               404: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            },
         },
      },
   },
}
