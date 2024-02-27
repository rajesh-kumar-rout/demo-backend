import { Router } from "express"
import { fetch, query } from "../utils/db.js"

const router = Router()

router.get("/", async (req, res) => {
    const { totalProducts } = await fetch("SELECT COUNT(*) AS totalProducts FROM products")

    if(totalProducts === 0) {
        await query(`
            INSERT INTO products (name) VALUES
            ('Savings Account'),
            ('Current Account'),
            ('Fixed Deposit'),
            ('Recurring Deposit'),
            ('Home Loan'),
            ('Personal Loan'),
            ('Credit Card'),
            ('Car Loan'),
            ('Business Loan'),
            ('Health Insurance')
        `)
    }

    const { totalEmployees } = await fetch("SELECT COUNT(*) AS totalEmployees FROM employees")

    if(totalEmployees === 0) {
        await query(`
            INSERT INTO employees (name, email, password, salary, isAdmin, isActive) VALUES
            ('Admin User', 'admin@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, TRUE, TRUE),
            ('John Doe', 'john.doe@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Jane Smith', 'jane.smith@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Michael Johnson', 'michael.johnson@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Emily Davis', 'emily.davis@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Robert Williams', 'robert.williams@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Amanda Wilson', 'amanda.wilson@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Daniel Brown', 'daniel.brown@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Sophia Miller', 'sophia.miller@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE),
            ('Ethan Jones', 'ethan.jones@example.com', '$2b$10$WtcPje.8Cy3E2nerFfrsF.hp86Ly2ln37RYVlFHsPpcrsJzrRivlC', 40000, FALSE, TRUE)`
        )
    }

    const { totalCustomers } = await fetch("SELECT COUNT(*) AS totalCustomers FROM customers")

    if(totalCustomers === 0) {
        await query(`
            INSERT INTO customers (name, mobile) VALUES
            ('John Doe', 9988774499),
            ('Jane Smith', 9988774492),
            ('Michael Johnson', 9988774498),
            ('Emily Davis', 9988774494)
        `)
    }

    const { totalHolidays } = await fetch("SELECT COUNT(*) AS totalHolidays FROM holiday_packages")

    if(totalHolidays === 0) {
        await query(`
            INSERT INTO holiday_packages (name, duration, destination, location) VALUES
            ('Goa Adventure Package', 3, 'Goa', 'Calangute'),
            ('Himalayan Retreat Package', 5, 'Manali', 'Solang Valley'),
            ('Kerala Backwaters Bliss Package', 4, 'Kochi', 'Alleppey')
        `)

        await query(`DELETE FROM amenities`)

        await query(`
            INSERT INTO amenities (name, holidayPackageId) VALUES
            ('Water Sports', 1),
            ('Cruise', 1),
            ('Local Sightseeing', 1),
            ('Mountain Trekking', 2),
            ('Skiing', 2),
            ('Hot Springs', 2),
            ('Houseboat Stay', 3),
            ('Ayurvedic Spa', 3),
            ('Backwater Cruise', 3)
        `)
    }

    let message = "Seeding database successfully"

    if (req.query.action === "sales") {
        const {customerId} = await fetch("SELECT id AS customerId FROM customers ORDER BY RAND() LIMIT 1")

        const employee = await fetch("SELECT * FROM employees WHERE isAdmin = 0 AND isActive = 1 ORDER BY RAND() LIMIT 1")

        const {productId} = await fetch("SELECT id AS productId FROM products ORDER BY RAND() LIMIT 1")
        
        let sql = ""

        for (let i = 1; i < 10000; i++) {
            sql += `(${customerId}, ${employee.id}, ${productId}) ${i !== 9999 ? "," : ""}`
        }

        await query(`INSERT INTO sales (customerId, employeeId, productId) VALUES ${sql}`)

        message = `Seeding database successfully - Email - ${employee.email}, id - ${employee.id}`
    }

    res.send(message)
})

export default router