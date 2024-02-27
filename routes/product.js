import { Router } from "express"
import { fetchAll } from "../utils/db.js"

const router = Router()

router.get("/", async (req, res) => {
    const products = await fetchAll("SELECT * FROM products")

    res.json(products)
})

export default router