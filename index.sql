CREATE DATABASE incentive_management;

USE `incentive_management`;

CREATE TABLE customers (
    `id` BIGINT(20) AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `mobile` BIGINT(10) UNIQUE NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE employees(
    `id` BIGINT(20) AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `email` VARCHAR(40) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `salary` INT NOT NULL,
    `isAdmin` BOOLEAN DEFAULT False,
    `isActive` BOOLEAN DEFAULT True,
    PRIMARY KEY (`id`)
);

CREATE TABLE holiday_packages(
    `id` BIGINT(20) AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `duration` INT NOT NULL,
    `destination` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE amenities(
    `id` BIGINT(20) AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `holidayPackageId` BIGINT(20),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`holidayPackageId`) REFERENCES `holiday_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE incentives(
    `id` BIGINT(20) AUTO_INCREMENT,
    `percentage` FLOAT,
    `amount` INT NOT NULL,
    `bonus` INT,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `holidayPackageId` BIGINT(20),
    `employeeId` BIGINT(20),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`holidayPackageId`) REFERENCES `holiday_packages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE products(
    `id` BIGINT(20) AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE sales (
    `id` BIGINT(20) AUTO_INCREMENT,
    `customerId` BIGINT(20),
    `employeeId` BIGINT(20),
    `productId` BIGINT(20),
    FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (`id`)
);

CREATE TABLE auth_tokens (
    `token` VARCHAR(255),
    `employeeId` BIGINT(20),
    FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

