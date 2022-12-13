# Login Node REST API

screenshot:
  ![alt](/public/assets/api-ss.png))

To build locally

  1. install MySql and start MySql server
  2. create database and users table
  3. create a env.js file
  4. add these value in env.js file
    `const env = {
      DB_PASSWORD: '<db_password>',
      DB_USER: '<db_username>',
      DB_NAME: '<db_name>',
      DB_HOST: '<db_hostname>',
      DB_PORT: <db_port>,
      DB_TABLE: '<db_table>'
  };
  module.exports = { env };`
  5. `npm start`
