import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating Super Admin account...')

  const hashedPassword = await bcrypt.hash('Admin@2026', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ktlgea.gov.ng' },
    update: {},
    create: {
      email: 'admin@ktlgea.gov.ng',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      staffType: 'LEA_ADMIN',
      isActive: true,
      emailVerified: true,
    },
  })

  console.log('✅ Super Admin created!')
  console.log('Email:', admin.email)
  console.log('Password: Admin@2026')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })