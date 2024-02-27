import { Router } from "express"
import { fetchAll, insert, fetch, query } from "../utils/db.js"
import { body, validationResult } from "express-validator"

const router = Router()

router.get("/", async (req, res) => {
    const employeeId = req.employee.id

    const page = parseInt(req.query.page) ?? 1

    const limit = 10

    const offset = (page * 10) - 10

    const { totalSales } = await fetch(`SELECT COUNT(*) AS totalSales FROM sales WHERE employeeId = ${employeeId}`)

    const sales = await fetchAll(`SELECT sales.id, products.name AS product, customers.name, customers.mobile FROM sales INNER JOIN customers ON customers.id = sales.customerId INNER JOIN products ON products.id = sales.productId WHERE employeeId = ${employeeId} ORDER BY sales.id DESC LIMIT ${limit} OFFSET ${offset}`)

    res.json({
        totalPage: Math.ceil(totalSales / 10),
        data: sales
    })
})

router.post(
    "/",

    body("name").isString().bail().trim().notEmpty(),
    body("mobile").isInt(),
    body("productId").isInt(),

    async (req, res) => {
        const result = validationResult(req)

        if (!result.isEmpty()) {
            return res.status(422).json(result.array())
        }

        const { employee } = req

        const { name, mobile, productId } = req.body

        const product = await fetch("SELECT * FROM products WHERE id = :productId", { productId })

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        const customer = await fetch("SELECT * FROM customers WHERE mobile = :mobile LIMIT 1", { mobile })

        let customerId = null

        if (customer) {
            customerId = customer.id
        } else {
            customerId = await insert("INSERT INTO customers (name, mobile) VALUES (:name, :mobile)", {
                name,
                mobile
            })
        }

        await insert(`INSERT INTO sales (customerId, employeeId, productId) VALUES (${customerId}, ${employee.id}, ${product.id})`)

        const { totalSales } = await fetch(`SELECT COUNT(*) AS totalSales FROM sales WHERE employeeId = ${employee.id}`)

        let percentage = null
        let bonus = null
        let holidayPackageId = null
        let eligible = false

        if (totalSales === 50000) {
            const holidayPackage = await fetch(`SELECT id FROM holiday_packages ORDER BY RAND() LIMIT 1`)
            holidayPackageId = holidayPackage.id
            percentage = 5
            eligible = true
        } else if (totalSales === 30000) {
            percentage = 3.5
            bonus = 1000
            eligible = true
        } else if (totalSales === 20000) {
            percentage = 3
            eligible = true
        } else if (totalSales === 10000) {
            percentage = 1.5
            eligible = true
        }

        if (eligible) {
            const amount = Math.round(employee.salary * percentage / 100)
            await query(`INSERT INTO incentives (percentage, amount, bonus, holidayPackageId, employeeId) VALUES (${percentage}, ${amount}, ${bonus}, ${holidayPackageId}, ${employee.id})`)
        }

        res.status(201).json({ message: "Sale added successfully" })
    }
)

export default router