import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const symptomCount = await prisma.symptom.count()
  const diseaseCount = await prisma.disease.count()
  console.log('Symptom count:', symptomCount)
  console.log('Disease count:', diseaseCount)
  
  if (symptomCount > 0) {
    const symptoms = await prisma.symptom.findMany({ take: 5 })
    console.log('Sample symptoms:', JSON.stringify(symptoms, null, 2))
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
