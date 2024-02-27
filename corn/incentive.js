import { config } from "dotenv"
import nodemailer from "nodemailer"
import { fetch, fetchAll } from "../utils/db.js"

config()

export default async function incentive() {
    const transporter = nodemailer.createTransport({
        port: process.env.MAIL_PORT,
        host: process.env.MAIL_HOST,
        secure: process.env.MAIL_HTTPS,
        service: process.env.MAIL_SERVER,
        auth: {
            user: process.env.MAIL_FROM,
            pass: process.env.MAIL_PASSWORD
        }
    })

    const employees = await fetchAll("SELECT * FROM employees WHERE isAdmin = 0 AND isActive = 1")

    for (const employee of employees) {
        const { totalSales } = await fetch(`SELECT COUNT(*) AS totalSales FROM sales WHERE employeeId = ${employee.id}`)

        const incentive = await fetchAll(`SELECT * FROM incentives WHERE employeeId = ${employee.id} AND createdAt = CURDATE()`)

        const options = {
            to: employee.email,
            subject: "Your Daily Incentive Details",
            html: `<p>Hello ${employee.name},</p>
                   <p>Your daily performance metrics:</p>
                   <ul>
                        <li>Sales: ${totalSales}</li>
                        <li>Incentive Percentage: ${incentive.percentage ? incentive.percentage + "%" : "NA"}</li>
                        <li>Bonus: ${incentive.bonus ? incentive.bonus + "$" : "NA"}</li>
                        <li>Holiday Package: ${incentive.holidayPackageId ? "Eligible" : "Not Eligible"}</li>
                   </ul>
                   <p>Thank you for your hard work!</p>`
        }

        transporter.sendMail(options)
    }
}
