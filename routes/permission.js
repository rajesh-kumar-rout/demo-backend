import { Router } from "express"
import { fetchAll, query } from "../utils/db.js"

const router = Router()

router.get("/", async (req, res) => {
    const { id } = req.employee

    const employees = await fetchAll(`SELECT id, name, email, isAdmin, isActive FROM employees WHERE id <> ${id}`)

    res.json(employees)
})

router.patch("/:id", async (req, res) => {
    const { id } = req.params

    const { action } = req.query

    let sql = "UPDATE employees SET :cols WHERE id = :id"

    let message = null

    if (action === "deactivate") {
        sql = sql.replace(":cols", "isActive = 0")
        message = "Account deactivated successfully"
    } else if (action === "activate") {
        sql = sql.replace(":cols", "isActive = 1")
        message = "Account activated successfully"
    } else if (action === "makeAdmin") {
        sql = sql.replace(":cols", "isAdmin = 1")
        message = "Admin access provided successfully"
    } else if (action === "removeAdmin") {
        sql = sql.replace(":cols", "isAdmin = 0")
        message = "Admin accessed revoked successfully"
    }

    await query(sql, { id })

    res.json({ message })
})

export default router