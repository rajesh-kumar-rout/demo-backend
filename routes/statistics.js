import { Router } from "express"
import { fetch } from "../utils/db.js"

const router = Router()

router.get("/", async (req, res) => {
    const employee = req.employee

    if (employee.isAdmin) {
        const { totalPackages } = await fetch("SELECT COUNT(*) AS totalPackages FROM holiday_packages")

        const { totalEmployees } = await fetch("SELECT COUNT(*) AS totalEmployees FROM employees")

        return res.json([
            {
                label: "Total Holiday Packages",
                count: totalPackages
            },
            {
                label: "Total Employees",
                count: totalEmployees
            }
        ])
    }

    const { totalSales } = await fetch(`SELECT COUNT(*) AS totalSales FROM sales WHERE employeeId = ${employee.id}`)

    res.json([
        {
            label: "Total Sales",
            count: totalSales
        }
    ])
})

export default router