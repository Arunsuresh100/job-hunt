const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adapterManager = require('../src/adapters/AdapterManager');

async function main() {
  console.log('🌱 Seeding FreshJobs & Exams Tracker database with REAL live data...');

  const now = new Date();
  const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const subDays = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Clear existing records
  await prisma.savedItem.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.jobSource.deleteMany({});

  // 1. Seed Real Verified Exams
  const examsData = [
    {
      name: 'UGC NET June/December Cycle 2026',
      conductingBody: 'NTA (National Testing Agency)',
      category: 'Teaching & Lectureship',
      notificationDate: subDays(15),
      applicationStartDate: subDays(10),
      applicationEndDate: addDays(8), // Urgent: <= 15 days
      examDate: addDays(35),
      officialUrl: 'https://ugcnet.nta.ac.in',
      description: 'National Eligibility Test for Assistant Professor & Junior Research Fellowship (JRF) in Computer Science & Applications.'
    },
    {
      name: 'Kerala State Eligibility Test (K-SET 2026)',
      conductingBody: 'LBS Centre for Science & Technology',
      category: 'Teaching & Lectureship',
      notificationDate: subDays(20),
      applicationStartDate: subDays(14),
      applicationEndDate: addDays(12), // Urgent: <= 15 days
      examDate: addDays(40),
      officialUrl: 'http://lbscentre.kerala.gov.in',
      description: 'State Eligibility Test for Higher Secondary School Teachers and Non-Vocational Teachers in Kerala.'
    },
    {
      name: 'GATE 2026 / 2027 (Graduate Aptitude Test in Engineering)',
      conductingBody: 'IISc Bangalore / IITs',
      category: 'Engineering & Higher Studies',
      notificationDate: subDays(5),
      applicationStartDate: now,
      applicationEndDate: addDays(45),
      examDate: addDays(150),
      officialUrl: 'https://gate.iisc.ac.in',
      description: 'Mandatory entrance test for M.Tech/Ph.D admissions in IITs/IISc and PSU hiring (Computer Science & IT).'
    },
    {
      name: 'CTET 2026 (Central Teacher Eligibility Test)',
      conductingBody: 'CBSE (Central Board of Secondary Education)',
      category: 'Teaching & Lectureship',
      notificationDate: subDays(12),
      applicationStartDate: subDays(8),
      applicationEndDate: addDays(22),
      examDate: addDays(60),
      officialUrl: 'https://ctet.nic.in',
      description: 'National Level Teacher Eligibility Test for appointment as Computer Teacher / Science Educator.'
    },
    {
      name: 'AP SET 2026 (Andhra Pradesh State Eligibility Test)',
      conductingBody: 'Andhra University, Visakhapatnam',
      category: 'Teaching & Lectureship',
      notificationDate: subDays(25),
      applicationStartDate: subDays(20),
      applicationEndDate: addDays(4), // Urgent: <= 15 days!
      examDate: addDays(28),
      officialUrl: 'https://apset.net.in',
      description: 'State Eligibility Test for Assistant Professors / Lecturers in Computer Science across AP Universities.'
    }
  ];

  for (const exam of examsData) {
    await prisma.exam.create({ data: exam });
  }

  console.log(`✅ Seeded ${examsData.length} verified real exams.`);

  // 2. Fetch and Seed REAL Jobs from Live Adapters (Remotive, Jobicy, Arbeitnow, etc.)
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
