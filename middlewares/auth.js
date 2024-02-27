import { fetch } from "../utils/db.js"

export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers

    const token = authorization?.slice(7, authorization?.length) ?? null

    const employee = await fetch("SELECT employees.* FROM auth_tokens INNER JOIN employees ON employees.id = auth_tokens.employeeId WHERE token = :token", { token })

    if (employee) {
        req.employee = employee
    } else {
        req.employee = null
    }

    next()
}

export const isAuthenticated = async (req, res, next) => {
    const employee = req.employee

    if (!employee) {
        return res.status(401).json({ message: "Unauthenticated" })
    }

    next()
}

export const isAdmin = async (req, res, next) => {
    const employee = req.employee

    if (!employee.isAdmin) {
        return res.status(403).json({ message: "Access denied" })
    }

    next()
}

export const isActive = async (req, res, next) => {
    const employee = req.employee

    if (!employee.isActive) {
        return res.status(403).json({ message: "Access denied" })
    }

    next()
}
