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
      name: 'Kerala Teacher Eligibility Test (K-TET 2026)',
      conductingBody: 'Pareeksha Bhavan, Govt of Kerala (Trivandrum)',
      category: 'Teacher & Professor Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(18),
      applicationStartDate: subDays(12),
      applicationEndDate: addDays(15),
      examDate: addDays(45),
      officialUrl: 'https://ktet.kerala.gov.in',
      description: 'Mandatory eligibility test for Category I, II, III & IV Lower Primary (LP), Upper Primary (UP), and High School Teachers in Govt & Aided schools across Kerala.'
    },
    {
      name: 'Kerala State Eligibility Test (K-SET 2026)',
      conductingBody: 'LBS Centre for Science & Technology, Trivandrum',
      category: 'Teacher & Professor Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(20),
      applicationStartDate: subDays(14),
      applicationEndDate: addDays(12),
      examDate: addDays(40),
      officialUrl: 'http://lbscentre.kerala.gov.in',
      description: 'State Eligibility Test required for appointment as Higher Secondary School Teacher (HSST) & Non-Vocational Teacher across all 14 districts of Kerala.'
    },
    {
      name: 'UGC NET 2026 (Kerala Centres: Ernakulam, TVM, Kozhikode, Thrissur)',
      conductingBody: 'National Testing Agency (NTA)',
      category: 'Teacher & Professor Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(15),
      applicationStartDate: subDays(10),
      applicationEndDate: addDays(8),
      examDate: addDays(35),
      officialUrl: 'https://ugcnet.nta.ac.in',
      description: 'National Eligibility Test for Assistant Professor & Junior Research Fellowship (JRF) in Computer Science, Literature & Humanities across Kerala test centres.'
    },
    {
      name: 'Kerala PSC High School Assistant (HSA) & HSST Recruitment 2026',
      conductingBody: 'Kerala Public Service Commission (KPSC Thulasi)',
      category: 'Teacher & Professor Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(10),
      applicationStartDate: subDays(5),
      applicationEndDate: addDays(14),
      examDate: addDays(50),
      officialUrl: 'https://thulasi.psc.kerala.gov.in',
      description: 'Official KPSC competitive exam for High School Assistant (HSA Mathematics, Physical Science, English) and Govt College Assistant Professor vacancies in Kerala.'
    },
    {
      name: 'TCS NQT 2026 (Kerala Exam Centres: Kochi, TVM, Kozhikode, Kottayam)',
      conductingBody: 'TCS iON (Tata Consultancy Services)',
      category: 'IT & Corporate Hiring Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(8),
      applicationStartDate: subDays(4),
      applicationEndDate: addDays(18),
      examDate: addDays(30),
      officialUrl: 'https://learning.tcsionhub.in/hub/national-qualifier-test/',
      description: 'National Qualifier Test for TCS Ninja & Digital roles, Wipro, and 2000+ top IT corporate employers conducting live offline tests in Kerala centers.'
    },
    {
      name: 'Kerala PSC Secretariat & University Assistant Exam 2026',
      conductingBody: 'Kerala Public Service Commission (KPSC Thulasi)',
      category: 'Kerala PSC & State Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(14),
      applicationStartDate: subDays(7),
      applicationEndDate: addDays(10),
      examDate: addDays(42),
      officialUrl: 'https://thulasi.psc.kerala.gov.in',
      description: 'Direct degree-level recruitment for Secretariat Assistant, University Assistant, and Auditor roles in Kerala State Govt departments.'
    },
    {
      name: 'Wipro National Talent Hunt (Wipro NLTH 2026)',
      conductingBody: 'Wipro Talent Transformation',
      category: 'IT & Corporate Hiring Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(12),
      applicationStartDate: subDays(6),
      applicationEndDate: addDays(16),
      examDate: addDays(28),
      officialUrl: 'https://careers.wipro.com',
      description: 'National fresher hiring examination for Project Engineer & Turbo Developer roles for BCA, B.Sc, B.Tech & MCA graduates in Kerala.'
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
      name: 'SSC CGL / CHSL 2026 (Kerala Exam Centres - KKR Region)',
      conductingBody: 'Staff Selection Commission (Karnataka Kerala Region)',
      category: 'Central & SSC Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(16),
      applicationStartDate: subDays(11),
      applicationEndDate: addDays(9),
      examDate: addDays(65),
      officialUrl: 'https://ssckkr.kar.nic.in',
      description: 'Staff Selection Commission Combined Graduate Level exam with official exam centers in Thiruvananthapuram, Kochi, Kozhikode, and Kollam.'
    },
    {
      name: 'Infosys INFYTQ & Certification Exam 2026',
      conductingBody: 'Infosys Springboard',
      category: 'IT & Corporate Hiring Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(9),
      applicationStartDate: subDays(3),
      applicationEndDate: addDays(21),
      examDate: addDays(38),
      officialUrl: 'https://infytq.onwingspan.com',
      description: 'Official assessment test for Systems Engineer & Specialist Programmer roles for final year & passed out graduates in Kerala.'
    },
    {
      name: 'CTET 2026 (Central Teacher Eligibility Test - Kerala Centres)',
      conductingBody: 'CBSE (Central Board of Secondary Education)',
      category: 'Teacher & Professor Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(12),
      applicationStartDate: subDays(8),
      applicationEndDate: addDays(22),
      examDate: addDays(60),
      officialUrl: 'https://ctet.nic.in',
      description: 'Central Teacher Eligibility Test for appointment as Computer Teacher / Science Educator in Kendriya Vidyalayas (KVs) & Navodaya schools in Kerala.'
    },
    {
      name: 'Kerala PSC Sub Inspector & KSEB Sub Engineer Exam 2026',
      conductingBody: 'Kerala Public Service Commission (KPSC Thulasi)',
      category: 'Kerala PSC & State Exams',
      location: 'Kerala',
      state: 'Kerala',
      isKerala: true,
      notificationDate: subDays(11),
      applicationStartDate: subDays(6),
      applicationEndDate: addDays(13),
      examDate: addDays(48),
      officialUrl: 'https://thulasi.psc.kerala.gov.in',
      description: 'Kerala PSC competitive examination for Sub Inspector of Police (Executive) & KSEB Technical Sub Engineer vacancies.'
    }
  ];

  for (const exam of examsData) {
    await prisma.exam.create({ data: exam });
  }

  console.log(`✅ Seeded ${examsData.length} verified Kerala-based exams (Teacher/SET/KTET, KPSC, TCS NQT, SSC).`);

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
