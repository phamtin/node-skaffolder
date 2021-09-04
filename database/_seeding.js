if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

let DB_URL = '';

if (process.env.NODE_ENV === 'development') {
  DB_URL = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
} else {
  // DB_URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
}

const data = [
  require('./dataSeeding/book'),
  require('./dataSeeding/exchangeType'),
  require('./dataSeeding/role'),
  require('./dataSeeding/users'),
];

seeder.connect(DB_URL, () => {
  seeder.loadModels([
    '../src/models/book.model.js',
    '../src/models/user.model.js',
    '../src/models/exchangeType.model.js',
    '../src/models/role.model.js',
  ]);

  seeder.clearModels(['User', 'Book', 'ExchangeType', 'Role'], () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
