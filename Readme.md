Payment Service

To run the payment service in your local needs to following

1. You can either install rabbitmq in your local machine or run it via docker, I have used a docker image for this
2. You can either install mysql in your local machine or run it via docker, since mysql has already been installed in my local so I have used the local instance. 

Once installed then you can use the following commands to create the user and database.

-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS payment_db;

-- Create a dedicated user
CREATE USER 'payment_user'@'%' IDENTIFIED BY 'somePassword';

-- Grant privileges to the user on the payment_db database
GRANT ALL PRIVILEGES ON payment_db.* TO 'payment_user'@'%';
FLUSH PRIVILEGES;

3. Installing the npm depencies

npm install 
npm run build
npm run start 