import bcrypt from "bcrypt";
import config from "@/config";
import { prisma } from "@/lib/prisma";

async function main() {
    const email = config.admin.email;
    const password = config.admin.password;

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
