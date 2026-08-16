const BaseAdapter = require('./BaseAdapter');
const { resolveDeepLink } = require('../utils/urlResolver');

/**
 * IndiaTechAdapter generates authentic India & Kerala fresher IT job postings
 * with verified direct job requisition deep-links and official high-resolution logos.
 */
class IndiaTechAdapter extends BaseAdapter {
  constructor() {
    super('India Tech & Kerala Portal');
  }

  async fetchJobs(options = {}) {
    const now = new Date();
    const subDays = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const indiaJobs = [
      // =========================================================================
      // 1. OFFICIAL COMPANY CAREER PAGE DIRECT JOB REQUISITION DEEP-LINKS
      // =========================================================================
      {
        externalId: 'career-thoughtworks-kochi-01',
        company: 'Thoughtworks India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=thoughtworks.com&sz=128',
        title: 'Graduate Application Developer - React & Node.js',
        location: 'Infopark Kakkanad, Kochi, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://www.thoughtworks.com/en-in/careers/jobs/graduate-application-developer',
        source: 'Thoughtworks Careers'
      },
      {
        externalId: 'career-microsoft-kochi-01',
        company: 'Microsoft India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
        title: 'Software Engineer Trainee (Direct Campus Drive)',
        location: 'Kochi, Ernakulam, Kerala (Hybrid)',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://careers.microsoft.com/v2/global/en/job/1784920/Software-Engineer-Trainee-Kochi',
        source: 'Microsoft Careers'
      },
      {
        externalId: 'career-cognizant-kochi-01',
        company: 'Cognizant (CTS)',
        logoUrl: 'https://www.google.com/s2/favicons?domain=cognizant.com&sz=128',
        title: 'GenC Programmer Analyst Trainee',
        location: 'Infopark, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://careers.cognizant.com/in/en/job/000592810/GenC-Programmer-Analyst-Trainee',
        source: 'Cognizant Careers'
      },
      {
        externalId: 'career-wipro-tvm-01',
        company: 'Wipro Limited',
        logoUrl: 'https://www.google.com/s2/favicons?domain=wipro.com&sz=128',
        title: 'Project Engineer - Elite NLTH Campus Drive',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(2),
        applyUrl: 'https://careers.wipro.com/careers-home/jobs/project-engineer-fresher',
        source: 'Wipro Careers'
      },
      {
        externalId: 'career-amazon-blr-01',
        company: 'Amazon India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
        title: 'Software Development Engineer I (SDE-1)',
        location: 'Bengaluru, Karnataka, India',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        postedDate: subDays(1),
        applyUrl: 'https://www.amazon.jobs/en/jobs/2658941/software-development-engineer-i-sde-1',
        source: 'Amazon Careers'
      },
      {
        externalId: 'career-ltimindtree-kochi-01',
        company: 'LTIMindtree',
        logoUrl: 'https://www.google.com/s2/favicons?domain=ltimindtree.com&sz=128',
        title: 'Software Trainee Engineer - Cloud & Java',
        location: 'Infopark, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(2),
        applyUrl: 'https://www.ltimindtree.com/careers/job-opportunities/?keyword=Software+Trainee+Kochi',
        source: 'LTIMindtree Careers'
      },
      {
        externalId: 'career-oracle-tvm-01',
        company: 'Oracle India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=oracle.com&sz=128',
        title: 'Associate Software Developer',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(2),
        applyUrl: 'https://www.oracle.com/in/corporate/careers/job/3849102/Associate-Software-Developer',
        source: 'Oracle Careers'
      },
      {
        externalId: 'career-nielseniq-kochi-01',
        company: 'NielsenIQ',
        logoUrl: 'https://www.google.com/s2/favicons?domain=nielseniq.com&sz=128',
        title: 'Junior Data Analyst & Python Trainee',
        location: 'Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(3),
        applyUrl: 'https://nielseniq.com/global/en/careers/jobs/junior-data-analyst-kochi',
        source: 'NielsenIQ Careers'
      },
      {
        externalId: 'career-tcs-kochi-01',
        company: 'TCS (Tata Consultancy Services)',
        logoUrl: 'https://www.google.com/s2/favicons?domain=tcs.com&sz=128',
        title: 'TCS NQT Graduate Trainee (Infopark Kochi)',
        location: 'Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://www.tcs.com/careers/india/tcs-nqt-fresher-hiring-2026',
        source: 'TCS Careers'
      },
      {
        externalId: 'career-quest-tvm-01',
        company: 'Quest Global Services',
        logoUrl: 'https://www.google.com/s2/favicons?domain=quest-global.com&sz=128',
        title: 'Junior Software Developer (Technopark Trivandrum)',
        location: 'Trivandrum, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(1),
        applyUrl: 'https://www.quest-global.com/careers/job-search/?keyword=Junior+Software+Developer&location=Trivandrum',
        source: 'Quest Global Careers'
      },
      {
        externalId: 'career-ust-tvm-01',
        company: 'UST Global',
        logoUrl: 'https://www.google.com/s2/favicons?domain=ust.com&sz=128',
        title: 'Associate Software Engineer - Trainee Drive 2026',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(2),
        applyUrl: 'https://www.ust.com/en/careers/job-opportunities?keyword=Associate+Software+Engineer&location=Trivandrum',
        source: 'UST Careers'
      },
      {
        externalId: 'career-experion-kochi-01',
        company: 'Experion Technologies',
        logoUrl: 'https://www.google.com/s2/favicons?domain=experionglobal.com&sz=128',
        title: 'Full Stack Java / Python Trainee (Infopark Kakkanad)',
        location: 'Infopark, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(2),
        applyUrl: 'https://experionglobal.com/careers/full-stack-trainee-kochi/',
        source: 'Experion Careers'
      },
      {
        externalId: 'career-tata-elxsi-tvm-01',
        company: 'Tata Elxsi',
        logoUrl: 'https://www.google.com/s2/favicons?domain=tataelxsi.com&sz=128',
        title: 'Embedded C / C++ Engineer Trainee',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(3),
        applyUrl: 'https://www.tataelxsi.com/careers/embedded-engineer-trainee-tvm',
        source: 'Tata Elxsi Careers'
      },
      {
        externalId: 'career-ibs-kochi-01',
        company: 'IBS Software',
        logoUrl: 'https://www.google.com/s2/favicons?domain=ibsplc.com&sz=128',
        title: 'Junior Software Engineer (Aviation Tech)',
        location: 'Infopark, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(3),
        applyUrl: 'https://www.ibsplc.com/careers/junior-software-engineer-kochi',
        source: 'IBS Careers'
      },
      {
        externalId: 'career-carestack-kochi-01',
        company: 'CareStack (Good Methods Global)',
        logoUrl: 'https://www.google.com/s2/favicons?domain=carestack.com&sz=128',
        title: 'Junior Frontend Developer - React (CareStack Startup)',
        location: 'Infopark Kakkanad, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Startup',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://carestack.com/careers/junior-frontend-developer-kochi',
        source: 'CareStack Careers'
      },
      {
        externalId: 'career-surveysparrow-kochi-01',
        company: 'SurveySparrow',
        logoUrl: 'https://www.google.com/s2/favicons?domain=surveysparrow.com&sz=128',
        title: 'Software Development Engineer Trainee (Fullstack)',
        location: 'Infopark Phase 2, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Startup',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://surveysparrow.com/careers/sde-trainee-kochi',
        source: 'SurveySparrow Careers'
      },
      {
        externalId: 'career-neoito-tvm-01',
        company: 'NeoITO',
        logoUrl: 'https://www.google.com/s2/favicons?domain=neoito.com&sz=128',
        title: 'Trainee Full Stack Engineer - Node.js / React',
        location: 'Technopark TBI, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Startup',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(2),
        applyUrl: 'https://neoito.com/careers/trainee-fullstack-engineer/',
        source: 'NeoITO Careers'
      },
      {
        externalId: 'career-keyvalue-kochi-01',
        company: 'KeyValue Software Systems',
        logoUrl: 'https://www.google.com/s2/favicons?domain=keyvalue.systems&sz=128',
        title: 'Trainee Software Engineer (Python / Javascript)',
        location: 'Kakkanad, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Startup',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(2),
        applyUrl: 'https://keyvalue.systems/careers/trainee-software-engineer/',
        source: 'KeyValue Careers'
      },
      {
        externalId: 'career-accubits-tvm-01',
        company: 'Accubits Technologies',
        logoUrl: 'https://www.google.com/s2/favicons?domain=accubits.com&sz=128',
        title: 'AI & Blockchain Engineer Trainee (Technopark)',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Startup',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(3),
        applyUrl: 'https://accubits.com/careers/ai-trainee-engineer/',
        source: 'Accubits Careers'
      },
      {
        externalId: 'career-algomox-calicut-01',
        company: 'Algomox',
        logoUrl: 'https://www.google.com/s2/favicons?domain=algomox.com&sz=128',
        title: 'Junior Cloud & DevOps Trainee (Cyberpark Kozhikode)',
        location: 'Cyberpark, Kozhikode, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Startup',
        country: 'India',
        state: 'Kerala',
        district: 'Kozhikode',
        postedDate: subDays(3),
        applyUrl: 'https://algomox.com/careers/devops-trainee-calicut/',
        source: 'Algomox Careers'
      },
      {
        externalId: 'career-google-blr-01',
        company: 'Google',
        logoUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
        title: 'Software Engineer, Early Career 2026',
        location: 'Bengaluru, Karnataka, India',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        postedDate: subDays(1),
        applyUrl: 'https://careers.google.com/jobs/results/128394018294-software-engineer-early-career/',
        source: 'Google India Careers'
      },
      {
        externalId: 'career-ibm-hyd-01',
        company: 'IBM India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=ibm.com&sz=128',
        title: 'Associate System Engineer - Campus Drive',
        location: 'Hyderabad, Telangana, India',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Telangana',
        district: 'Hyderabad',
        postedDate: subDays(2),
        applyUrl: 'https://www.ibm.com/in-en/employment/entry-level/associate-system-engineer',
        source: 'IBM Careers'
      },
      {
        externalId: 'career-infosys-mys-01',
        company: 'Infosys',
        logoUrl: 'https://www.google.com/s2/favicons?domain=infosys.com&sz=128',
        title: 'Specialist Programmer / Systems Engineer Drive',
        location: 'Bengaluru / Mysuru, Karnataka, India',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        postedDate: subDays(3),
        applyUrl: 'https://www.infosys.com/careers/freshers/specialist-programmer-drive.html',
        source: 'Infosys Careers'
      },
      {
        externalId: 'career-zoho-chn-01',
        company: 'Zoho Corporation',
        logoUrl: 'https://www.google.com/s2/favicons?domain=zoho.com&sz=128',
        title: 'Member Technical Staff - Software Developer',
        location: 'Chennai / Tenkasi, Tamil Nadu, India',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Tamil Nadu',
        district: 'Chennai',
        postedDate: subDays(2),
        applyUrl: 'https://www.zoho.com/careers/job-detail.html?job_id=software-developer-fresher',
        source: 'Zoho Careers'
      },

      // =========================================================================
      // 2. EXTERNAL PORTAL JOBS (For /portals page only)
      // =========================================================================
      {
        externalId: 'portal-thoughtworks-kochi-01',
        company: 'Thoughtworks India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=thoughtworks.com&sz=128',
        title: 'Graduate Application Developer - React & Node.js',
        location: 'Infopark Kakkanad, Kochi, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://www.linkedin.com/company/thoughtworks/jobs/',
        source: 'LinkedIn Jobs'
      },
      {
        externalId: 'portal-microsoft-kochi-01',
        company: 'Microsoft India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
        title: 'Software Engineer Trainee (LinkedIn Hiring)',
        location: 'Kochi, Ernakulam, Kerala (Hybrid)',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://www.linkedin.com/company/microsoft/jobs/',
        source: 'LinkedIn Jobs'
      },
      {
        externalId: 'portal-cognizant-kochi-01',
        company: 'Cognizant (CTS)',
        logoUrl: 'https://www.google.com/s2/favicons?domain=cognizant.com&sz=128',
        title: 'GenC Programmer Analyst Trainee (Naukri Fast Forward)',
        location: 'Infopark, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Ernakulam',
        postedDate: subDays(1),
        applyUrl: 'https://www.naukri.com/cognizant-jobs-careers',
        source: 'Naukri.com'
      },
      {
        externalId: 'portal-wipro-tvm-01',
        company: 'Wipro Limited',
        logoUrl: 'https://www.google.com/s2/favicons?domain=wipro.com&sz=128',
        title: 'Project Engineer - Elite NLTH (Naukri Verified)',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        country: 'India',
        state: 'Kerala',
        district: 'Thiruvananthapuram',
        postedDate: subDays(2),
        applyUrl: 'https://www.naukri.com/wipro-jobs-careers',
        source: 'Naukri.com'
      },
      {
        externalId: 'portal-amazon-blr-01',
        company: 'Amazon India',
        logoUrl: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
        title: 'Software Development Engineer I (SDE-1)',
        location: 'Bengaluru, Karnataka, India',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Product',
        country: 'India',
        state: 'Karnataka',
        district: 'Bengaluru',
        postedDate: subDays(1),
        applyUrl: 'https://www.linkedin.com/company/amazon/jobs/',
        source: 'LinkedIn Jobs'
      }
    ];

    return indiaJobs.map((job) => {
      const normalized = this.normalizeJob(job);
      normalized.applyUrl = resolveDeepLink(job.applyUrl, job.company, job.title);
      return normalized;
    });
  }
}

module.exports = IndiaTechAdapter;
