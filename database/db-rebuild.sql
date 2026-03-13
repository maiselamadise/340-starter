-- ==========================================
-- Drop tables if they already exist
-- ==========================================

DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;

-- ==========================================
-- Create classification table
-- ==========================================

CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-- ==========================================
-- Create inventory table
-- ==========================================

CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50),
  inv_model VARCHAR(50),
  inv_year INT,
  inv_description TEXT,
  inv_image VARCHAR(255),
  inv_thumbnail VARCHAR(255),
  inv_price NUMERIC(10,2),
  inv_miles INT,
  inv_color VARCHAR(30),
  classification_id INT REFERENCES classification(classification_id)
);

-- ==========================================
-- Create account table
-- ==========================================

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50),
  account_lastname VARCHAR(50),
  account_email VARCHAR(100),
  account_password VARCHAR(255),
  account_type VARCHAR(20) DEFAULT 'Client'
);

-- ==========================================
-- Insert classification data
-- ==========================================

INSERT INTO classification (classification_name)
VALUES
('Sport'),
('SUV'),
('Truck'),
('Sedan');

-- ==========================================
-- Insert inventory data
-- ==========================================

INSERT INTO inventory
(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES
('GM','Hummer',2006,'This vehicle has small interiors but powerful performance.','/images/hummer.jpg','/images/hummer-tn.jpg',35000,50000,'Black',2),
('Ferrari','458 Italia',2015,'A high performance sports car.','/images/ferrari.jpg','/images/ferrari-tn.jpg',250000,12000,'Red',1),
('Lamborghini','Aventador',2019,'Luxury sport vehicle with extreme speed.','/images/lamborghini.jpg','/images/lamborghini-tn.jpg',400000,8000,'Yellow',1);