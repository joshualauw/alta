import bcrypt from "bcrypt";
import { commonConfig } from "@/config/commonConfig";
import { prisma } from "@/lib/prisma";

async function main() {
    const email = commonConfig.adminEmail;
    const password = commonConfig.adminPassword;

    const hashed = await bcrypt.hash(password, 10);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("Admin already exists");
        process.exit();
    }

    await prisma.user.create({
        data: {
            email,
            name: "admin",
            password: hashed,
            role: "ADMIN",
        },
    });

    console.log("Admin created");
    process.exit();
}

main();
