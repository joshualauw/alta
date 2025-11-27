import { commonConfig } from "@/config/commonConfig";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const email = commonConfig.adminEmail;
  const password = commonConfig.adminPassword;

  const hashed = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists");
    return;
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
}

main();
