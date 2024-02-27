import bcrypt from "bcrypt"
import crypto from "crypto"
import { Router } from "express"
import { isActive, isAuthenticated } from "../middlewares/auth.js"
import { fetch, insert, query } from "../utils/db.js"
import { body, validationResult } from "express-validator"

const router = Router()

router.get("/", async (req, res) => {
    const id = req.employee?.id ?? -1

    const employee = await fetch(`SELECT id, name, email, isAdmin, isActive FROM employees WHERE id = ${id} LIMIT 1`)

    res.json(employee)
})

router.post(
    "/login",

    body("email").isString().bail().trim().notEmpty(),

    body("password").isString().bail().notEmpty(),

    async (req, res) => {
        const result = validationResult(req)

        if (!result.isEmpty()) {
            return res.status(422).json(result.array())
        }

        const { email, password } = req.body

        const employee = await fetch("SELECT * FROM employees WHERE email = :email LIMIT 1", { email })

        if (!(employee && await bcrypt.compare(password, employee.password))) {
            return res.status(422).json({ message: "Invalid email or password" })
        }

        const token = crypto.randomBytes(32).toString("hex")

        await insert("INSERT INTO auth_tokens (employeeId, token) VALUES (:employeeId, :token)", {
            employeeId: employee.id,
            token
        })

        res.json({ token })
    }
)

router.delete("/logout", isAuthenticated, isActive, async (req, res) => {
    const { authorization } = req.headers

    const token = authorization?.slice(7, authorization?.length) ?? null

    await query("DELETE FROM auth_tokens WHERE token = :token", { token })

    res.json({ message: "Logout successfully" })
})

router.patch(
    "/password", 
    
    isAuthenticated, 
    
    isActive, 

    body("oldPassword").isString().bail().notEmpty(),
    body("newPassword").isString().bail().notEmpty().bail().isLength({min: 6, max: 20}),
    
    async (req, res) => {
        const result = validationResult(req)

        if(!result.isEmpty()) {
            return res.status(422).json(result.array())
        }

        const employeeId = req.employee.id

        const { oldPassword, newPassword } = req.body

        const employee = await fetch(`SELECT * FROM employees WHERE id = ${employeeId}`)

        if (!await bcrypt.compare(oldPassword, employee.password)) {
            return res.status(422).json({ message: "Old password does not match" })
        }

        await query(`UPDATE employees SET password = :password WHERE id = ${employeeId}`, {
            password: await bcrypt.hash(newPassword, 10)
        })

        res.json({ message: "Password changed successfully" })
    }
)

router.patch(
    "/", 
    
    isAuthenticated, 
    
    isActive, 

    body("name").isString().bail().trim().notEmpty(),
    
    async (req, res) => {
        const result = validationResult(req)

        if(!result.isEmpty()) {
            return res.status(422).json(result.array())
        }

        const employeeId = req.employee.id

        const { name } = req.body

        await query(`UPDATE employees SET name = :name WHERE id = ${employeeId}`, { name })

        res.json({ message: "Account edited successfully" })
    }
)

export default router