import { PrismaClient, Zone } from '@prisma/client'

const prisma = new PrismaClient()

const schools = [
  { code: '1212110014', name: 'Ahmadu Coomassie Model Primary School', zone: 'Zone A', ward: 'Gabas I' },
  { code: '1212110021', name: 'Dikko Memorial Primary School', zone: 'Zone B', ward: 'Gabas I' },
  { code: '1212110006', name: 'Dr Ibrahim Shehu Shema Primary School', zone: 'Zone B', ward: 'Gabas I' },
  { code: '1212110042', name: 'Fatima Ibrahim Shema Primary School', zone: 'Zone A', ward: 'Gabas I' },
  { code: '1212110034', name: 'Gidado Primary School', zone: 'Zone B', ward: 'Gabas I' },
  { code: '1212110045', name: 'Hassan Usman Science Model Primary School', zone: 'Zone A', ward: 'Gabas I' },
  { code: '1212140206', name: 'Hassu Iro Inko Primary School', zone: 'Zone B', ward: 'Gabas I' },
  { code: '1212110053', name: 'Model Quranic Primary School', zone: 'Zone B', ward: 'Gabas I' },
  { code: '1212110005', name: 'Modoji Village Primary School', zone: 'Zone A', ward: 'Gabas I' },
  { code: '1212110004', name: 'Sandan Bale Quranic Model Primary School', zone: 'Zone A', ward: 'Gabas I' },
  { code: '1212110031', name: 'Dan Masani Bala Saulawa Primary School', zone: 'Zone A', ward: 'Gabas II' },
  { code: '1212110142', name: 'Family Support Programme Primary School', zone: 'Zone B', ward: 'Gabas II' },
  { code: '1212110024', name: 'Mamman Barda Memorial Primary School', zone: 'Zone A', ward: 'Gabas II' },
  { code: '1212110046', name: 'Matawalle Ummaru Primary School', zone: 'Zone D', ward: 'Gabas II' },
  { code: '1212110044', name: 'Talba Ibrahim Science Model Primary School', zone: 'Zone D', ward: 'Gabas II' },
  { code: '1212110037', name: 'Sarkin Noma Bala Kamfani Primary School', zone: 'Zone F', ward: 'Yamma I' },
  { code: '1212110018', name: 'Comrade Muntari Lawal Primary School', zone: 'Zone F', ward: 'Yamma II' },
  { code: '1211410086', name: 'Government School for the Blind Primary School', zone: 'Zone C', ward: 'Yamma II' },
  { code: '1212110016', name: 'Hamza Maigoro Primary School', zone: 'Zone C', ward: 'Yamma II' },
  { code: '1212110002', name: 'Hassan Rafin Dadi Primary School', zone: 'Zone F', ward: 'Yamma II' },
  { code: '1212140208', name: 'Mannir Yakubu Primary School', zone: 'Zone F', ward: 'Yamma II' },
  { code: '1212110050', name: 'Muhammadu Buhari Primary School Katsina', zone: 'Zone F', ward: 'Yamma II' },
  { code: '1212110017', name: 'Dan-Marna Primary School', zone: 'Zone C', ward: 'Kudu I' },
  { code: '1212110001', name: 'Ummarun Dallaje Primary School', zone: 'Zone C', ward: 'Kudu I' },
  { code: '1212110035', name: 'Waziri Zayyana Primary School', zone: 'Zone C', ward: 'Kudu I' },
  { code: '1212110043', name: 'Isa Kaita Quranic Model Primary School', zone: 'Zone D', ward: 'Kudu II' },
  { code: '1212110040', name: 'Jabiru Abdullahi Memorial Primary School', zone: 'Zone D', ward: 'Kudu II' },
  { code: '1212110038', name: 'Muhammad Dodo Science Model Primary School', zone: 'Zone D', ward: 'Kudu II' },
  { code: '1212110023', name: 'Sabuwar Unguwa New Extension Primary School', zone: 'Zone D', ward: 'Kudu II' },
  { code: '1212110051', name: 'Bilingual School', zone: 'Zone C', ward: 'Kudu III' },
  { code: '1212110056', name: 'Dallatu Aminu Primary School', zone: 'Zone D', ward: 'Kudu III' },
  { code: '1212110039', name: 'Dr Kabir Usman Model Primary School', zone: 'Zone D', ward: 'Kudu III' },
  { code: '1212110041', name: 'Fatima Baika Girls Primary School', zone: 'Zone C', ward: 'Kudu III' },
  { code: '1212110012', name: 'Hon Sani Aliyu Danlami Primary School', zone: 'Zone C', ward: 'Kudu III' },
  { code: '1212110009', name: 'Senator Ibrahim Ida Primary School', zone: 'Zone C', ward: 'Kudu III' },
  { code: '1212110015', name: "Musa Yar'adua Quranic Model Primary School", zone: 'Zone C', ward: 'Arewa I' },
  { code: '1212110057', name: 'Sir Usman Nagogo Memorial Nursery, Primary and the Deaf School (NA)', zone: 'Zone B', ward: 'Arewa I' },
  { code: '1212110007', name: 'Barau Tukur Mangal Primary School', zone: 'Zone F', ward: 'Arewa II' },
  { code: '1212110036', name: 'Farin Yaro Primary School', zone: 'Zone F', ward: 'Arewa II' },
  { code: '1212110019', name: 'Garba Kaita Memorial Primary School', zone: 'Zone B', ward: 'Arewa II' },
  { code: '1212110020', name: 'Anas Mukaddas Nursery and Primary School', zone: 'Zone B', ward: 'Arewa II' },
  { code: '1212110003', name: 'Gobarau Primary School', zone: 'Zone F', ward: 'Arewa II' },
  { code: '1212110150', name: 'Iro Isansi Science Model Primary School', zone: 'Zone F', ward: 'Arewa II' },
  { code: '1212140218', name: 'Ambassador Audu Magaji Primary School', zone: 'Zone E', ward: 'Shinkafi A' },
  { code: '1212110029', name: 'Tafarki Dahiru Memorial (Dan-Nabaso) Primary School', zone: 'Zone E', ward: 'Shinkafi A' },
  { code: '1212110025', name: 'Dr. Abdulmuminu Kabir Usman (Shinkafi Quranic) Model Primary School', zone: 'Zone E', ward: 'Shinkafi A' },
  { code: '1212110022', name: 'Marai Nomadic Primary School', zone: 'Zone E', ward: 'Shinkafi A' },
  { code: '1212110152', name: 'Dr Kabir Magaji Gafiya Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212140216', name: 'Hayin Gagare Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212140215', name: 'Katoge Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110033', name: 'Kadifawa Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110032', name: 'Kambarawa Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110028', name: 'Kaurar Rafa Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110030', name: "Sa'i Amadu Nafuntua (Kwado) Primary School", zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110026', name: 'Nadada Memorial (Makera) Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110027', name: 'Sabon Garin Bakuru Primary School', zone: 'Zone E', ward: 'Shinkafi B' },
  { code: '1212110010', name: 'Lawal Ba Nomadic Primary School', zone: 'Zone E', ward: 'Kangiwa' },
  { code: '1212140205', name: 'Liman Munir (Tsallatori) Primary School', zone: 'Zone B', ward: 'Kangiwa' },
  { code: '1212140217', name: 'Liman Rufai (Kukar Gesa) Primary School', zone: 'Zone B', ward: 'Kangiwa' },
  { code: '1212110008', name: 'Nagogo Science Model Primary School', zone: 'Zone A', ward: 'Kangiwa' },
  { code: '1212110058', name: 'Pilot Senior Nagogo Primary School', zone: 'Zone A', ward: 'Kangiwa' },
]

async function main() {
  console.log('Seeding 61 schools for Katsina LGA...')

  let created = 0
  let skipped = 0

  for (const school of schools) {
    const existing = await prisma.school.findUnique({
      where: { code: school.code }
    })

    if (existing) {
      console.log(`Skipped (already exists): ${school.name}`)
      skipped++
      continue
    }

    await prisma.school.create({
      data: {
        name: school.name,
        code: school.code,
        ward: school.ward,
        zone: school.zone as unknown as Zone,
        lga: 'Katsina LGA',
        address: `${school.ward}, Katsina LGA, Katsina State`,
        isActive: true,
      }
    })

    console.log(`Created: ${school.name}`)
    created++
  }

  console.log(`\nDone. Created: ${created} | Skipped: ${skipped} | Total: ${schools.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
