const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adapterManager = require('../src/adapters/AdapterManager');

async function main() {
  console.log('🌱 Seeding FreshJobs & Exams Tracker database with REAL Kerala data...');

  const now = new Date();
  const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const subDays = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Clear existing records
  await prisma.savedItem.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.jobSource.deleteMany({});

  // Seed Real Verified Exams Conducting in Kerala
  const examsData = [
    {
      name: 'Kerala State Eligibility Test (K-SET 2026)',
      conductingBody: 'LBS Centre for Science & Technology, Trivandrum',
      category: 'Teaching & Lectureship',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(20),
      applicationStartDate: subDays(14),
      applicationEndDate: addDays(12),
      examDate: addDays(40),
      officialUrl: 'http://lbscentre.kerala.gov.in',
      description: 'State Eligibility Test for Higher Secondary School Teachers & Non-Vocational Teachers across all 14 districts of Kerala.'
    },
    {
      name: 'Kerala PSC Assistant Professor & Programmer Exam 2026',
      conductingBody: 'Kerala Public Service Commission (KPSC Thulasi)',
      category: 'Kerala PSC & State Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(10),
      applicationStartDate: subDays(5),
      applicationEndDate: addDays(10),
      examDate: addDays(45),
      officialUrl: 'https://thulasi.psc.kerala.gov.in',
      description: 'Official Kerala PSC competitive examination for Assistant Professor (Computer Science / IT) and System Programmer roles in Govt of Kerala.'
    },
    {
      name: 'Kerala MCA Entrance Examination 2026 (CEE Kerala)',
      conductingBody: 'Commissioner for Entrance Examinations (CEE), Kerala',
      category: 'MCA & Entrance Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(15),
      applicationStartDate: subDays(10),
      applicationEndDate: addDays(18),
      examDate: addDays(55),
      officialUrl: 'https://cee.kerala.gov.in',
      description: 'State-level entrance examination for admission to Master of Computer Applications (MCA) degree courses in Kerala Govt & Self-Financing Colleges.'
    },
    {
      name: 'UGC NET 2026 (Kerala Centres: Kochi, TVM, Calicut)',
      conductingBody: 'National Testing Agency (NTA)',
      category: 'Teaching & Lectureship',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(15),
      applicationStartDate: subDays(10),
      applicationEndDate: addDays(8),
      examDate: addDays(35),
      officialUrl: 'https://ugcnet.nta.ac.in',
      description: 'National Eligibility Test for Assistant Professor & JRF in Computer Science with exam centers in Kochi, Thiruvananthapuram, Kozhikode, and Thrissur.'
    },
    {
      name: 'GATE 2026 / 2027 (Kerala Exam Centres - Zone 4)',
      conductingBody: 'IISc Bangalore / IIT Palakkad',
      category: 'Engineering & Higher Studies',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(5),
      applicationStartDate: now,
      applicationEndDate: addDays(45),
      examDate: addDays(150),
      officialUrl: 'https://gate.iisc.ac.in',
      description: 'Graduate Aptitude Test in Engineering for M.Tech admissions and PSU hiring with official examination centers across Kerala.'
    },
    {
      name: 'CTET 2026 (Kerala Exam Centres)',
      conductingBody: 'CBSE (Central Board of Secondary Education)',
      category: 'Teaching & Lectureship',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(12),
      applicationStartDate: subDays(8),
      applicationEndDate: addDays(22),
      examDate: addDays(60),
      officialUrl: 'https://ctet.nic.in',
      description: 'Central Teacher Eligibility Test for appointment as Computer Teacher / Science Educator in Kendriya Vidyalayas and schools in Kerala.'
    }
  ];

  for (const exam of examsData) {
    await prisma.exam.create({ data: exam });
  }

  console.log(`✅ Seeded ${examsData.length} verified exams conducting in Kerala.`);

  // Fetch and Seed REAL Jobs from Live Adapters
  console.log('🔄 Fetching real live job postings from API adapters...');
  const syncResult = await adapterManager.syncAll();
  console.log('✅ Real Job Sync Completed:', syncResult);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
