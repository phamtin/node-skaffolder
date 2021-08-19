if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

let DB_URL = '';

if (process.env.NODE_ENV === 'development') {
  DB_URL = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
} else {
  // DB_URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
}

const data = [require('./users')];

seeder.connect(DB_URL, () => {
  seeder.loadModels([]);

  seeder.clearModels(['User'], () => {
    seeder.populateModels(data, () => {
      seeder.disconnect();
    });
  });
});
