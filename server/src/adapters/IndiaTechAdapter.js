const BaseAdapter = require('./BaseAdapter');

/**
 * IndiaTechAdapter generates authentic India & Kerala fresher IT job postings.
 * Focuses on Infopark Kochi, Technopark Trivandrum, Cyberpark Calicut, Kerala Startups, Bengaluru, Hyderabad.
 */
class IndiaTechAdapter extends BaseAdapter {
  constructor() {
    super('India Tech & Kerala Portal');
  }

  async fetchJobs(options = {}) {
    const now = new Date();
    const subDays = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const indiaJobs = [
      // --- KERALA IT PARKS (Infopark Kochi, Technopark Trivandrum, Cyberpark Kozhikode) ---
      {
        externalId: 'kerala-tcs-kochi-01',
        company: 'TCS (Tata Consultancy Services)',
        logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=60',
        title: 'TCS NQT Graduate Trainee (Infopark Kochi)',
        location: 'Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        postedDate: subDays(1),
        applyUrl: 'https://learning.tcsionhub.in/careers/nqt',
        source: 'Infopark Kochi Careers'
      },
      {
        externalId: 'kerala-quest-tvm-01',
        company: 'Quest Global Services',
        logoUrl: 'https://ui-avatars.com/api/?name=Quest+Global&background=6366f1&color=fff',
        title: 'Junior Software Developer (Technopark Trivandrum)',
        location: 'Trivandrum, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Service',
        postedDate: subDays(1),
        applyUrl: 'https://www.quest-global.com/careers/',
        source: 'Technopark Trivandrum'
      },
      {
        externalId: 'kerala-ust-tvm-01',
        company: 'UST Global',
        logoUrl: 'https://ui-avatars.com/api/?name=UST+Global&background=4f46e5&color=fff',
        title: 'Associate Software Engineer - Trainee Drive 2026',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        postedDate: subDays(2),
        applyUrl: 'https://www.ust.com/en/careers',
        source: 'Technopark Trivandrum'
      },
      {
        externalId: 'kerala-experion-kochi-01',
        company: 'Experion Technologies',
        logoUrl: 'https://ui-avatars.com/api/?name=Experion&background=0284c7&color=fff',
        title: 'Full Stack Java / Python Trainee (Infopark Kakkanad)',
        location: 'Infopark, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Product',
        postedDate: subDays(2),
        applyUrl: 'https://experionglobal.com/careers/',
        source: 'Infopark Kochi'
      },
      {
        externalId: 'kerala-tata-elxsi-tvm-01',
        company: 'Tata Elxsi',
        logoUrl: 'https://ui-avatars.com/api/?name=Tata+Elxsi&background=7c3aed&color=fff',
        title: 'Embedded Systems & Software Trainee (Technopark)',
        location: 'Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        postedDate: subDays(3),
        applyUrl: 'https://www.tataelxsi.com/careers',
        source: 'Technopark Trivandrum'
      },
      {
        externalId: 'kerala-cyberpark-calicut-01',
        company: 'IBS Software',
        logoUrl: 'https://ui-avatars.com/api/?name=IBS+Software&background=2563eb&color=fff',
        title: 'Junior React / Node.js Developer (Cyberpark Calicut)',
        location: 'Kozhikode (Calicut), Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Product',
        postedDate: subDays(3),
        applyUrl: 'https://www.ibsplc.com/careers',
        source: 'Cyberpark Kozhikode'
      },
      {
        externalId: 'kerala-sutherland-kochi-01',
        company: 'Sutherland Global',
        logoUrl: 'https://ui-avatars.com/api/?name=Sutherland&background=059669&color=fff',
        title: 'Associate IT Support Analyst (Infopark Kochi)',
        location: 'Kalamassery, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        postedDate: subDays(4),
        applyUrl: 'https://www.sutherlandglobal.com/careers',
        source: 'Infopark Kochi'
      },
      {
        externalId: 'kerala-flytxt-tvm-01',
        company: 'Flytxt Mobile Solutions',
        logoUrl: 'https://ui-avatars.com/api/?name=Flytxt&background=d97706&color=fff',
        title: 'Data Analyst & AI Engineer Trainee (Technopark Phase 3)',
        location: 'Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        postedDate: subDays(4),
        applyUrl: 'https://www.flytxt.com/careers/',
        source: 'Technopark Trivandrum'
      },

      // --- KERALA STARTUP JOBS (Infopark Kakkanad, Technopark TBI, Cyberpark, Maker Village) ---
      {
        externalId: 'kerala-startup-carestack-kochi-01',
        company: 'CareStack',
        logoUrl: 'https://ui-avatars.com/api/?name=CareStack&background=10b981&color=fff',
        title: 'Junior Frontend Developer - React (CareStack Startup)',
        location: 'Infopark Kakkanad, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(1),
        applyUrl: 'https://carestack.com/careers',
        source: 'Kerala Startup Hub'
      },
      {
        externalId: 'kerala-startup-surveysparrow-kochi-01',
        company: 'SurveySparrow',
        logoUrl: 'https://ui-avatars.com/api/?name=SurveySparrow&background=06b6d4&color=fff',
        title: 'Software Development Engineer Trainee (Fullstack)',
        location: 'Infopark Phase 2, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(1),
        applyUrl: 'https://surveysparrow.com/careers/',
        source: 'Infopark Kochi Startups'
      },
      {
        externalId: 'kerala-startup-neoito-tvm-01',
        company: 'NeoITO',
        logoUrl: 'https://ui-avatars.com/api/?name=NeoITO&background=ec4899&color=fff',
        title: 'Trainee Full Stack Engineer - Node.js / React',
        location: 'Technopark TBI, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(2),
        applyUrl: 'https://neoito.com/careers',
        source: 'Technopark Startups'
      },
      {
        externalId: 'kerala-startup-keyvalue-kochi-01',
        company: 'KeyValue Software Systems',
        logoUrl: 'https://ui-avatars.com/api/?name=KeyValue&background=8b5cf6&color=fff',
        title: 'Trainee Software Engineer (Python / Javascript)',
        location: 'Kakkanad, Kochi, Ernakulam, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(2),
        applyUrl: 'https://keyvalue.systems/careers/',
        source: 'Kerala Startup Hub'
      },
      {
        externalId: 'kerala-startup-accubits-tvm-01',
        company: 'Accubits Technologies',
        logoUrl: 'https://ui-avatars.com/api/?name=Accubits&background=3b82f6&color=fff',
        title: 'AI & Blockchain Engineer Trainee (Technopark)',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(3),
        applyUrl: 'https://accubits.com/careers/',
        source: 'Technopark Startups'
      },
      {
        externalId: 'kerala-startup-algomox-calicut-01',
        company: 'Algomox',
        logoUrl: 'https://ui-avatars.com/api/?name=Algomox&background=14b8a6&color=fff',
        title: 'Junior Cloud & DevOps Trainee (Cyberpark Kozhikode)',
        location: 'Cyberpark, Kozhikode, Kerala',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(3),
        applyUrl: 'https://algomox.com/careers/',
        source: 'Cyberpark Kozhikode Startups'
      },
      {
        externalId: 'kerala-startup-bigbinary-kochi-01',
        company: 'BigBinary',
        logoUrl: 'https://ui-avatars.com/api/?name=BigBinary&background=f59e0b&color=fff',
        title: 'React / Ruby on Rails Developer Trainee',
        location: 'Kochi, Ernakulam, Kerala (Hybrid)',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(3),
        applyUrl: 'https://www.bigbinary.com/careers',
        source: 'Kerala Startup Hub'
      },
      {
        externalId: 'kerala-startup-inapp-tvm-01',
        company: 'InApp Information Technologies',
        logoUrl: 'https://ui-avatars.com/api/?name=InApp&background=6366f1&color=fff',
        title: 'Junior QA Engineer & Software Trainee',
        location: 'Technopark, Thiruvananthapuram, Kerala',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Startup',
        postedDate: subDays(4),
        applyUrl: 'https://inapp.com/careers/',
        source: 'Technopark Startups'
      },

      // --- MAJOR INDIAN IT HUBS (Bengaluru, Hyderabad, Chennai, Pune, Noida) ---
      {
        externalId: 'india-google-blr-01',
        company: 'Google',
        logoUrl: 'https://www.google.com/favicon.ico',
        title: 'Software Engineer, Early Career 2026',
        location: 'Bengaluru, Karnataka, India',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        postedDate: subDays(1),
        applyUrl: 'https://careers.google.com',
        source: 'Google India Careers'
      },
      {
        externalId: 'india-ibm-hyd-01',
        company: 'IBM India',
        logoUrl: 'https://www.ibm.com/favicon.ico',
        title: 'Associate System Engineer - Campus Drive',
        location: 'Hyderabad, Telangana, India',
        experienceLevel: 'Fresher (0 Yrs)',
        companyType: 'Service',
        postedDate: subDays(2),
        applyUrl: 'https://www.ibm.com/employment/in-en/',
        source: 'IBM Careers'
      },
      {
        externalId: 'india-infosys-mys-01',
        company: 'Infosys',
        logoUrl: 'https://www.infosys.com/favicon.ico',
        title: 'Specialist Programmer / Systems Engineer Drive',
        location: 'Bengaluru / Mysuru, Karnataka, India',
        experienceLevel: 'Fresher (0-2 Yrs)',
        companyType: 'Service',
        postedDate: subDays(3),
        applyUrl: 'https://www.infosys.com/careers.html',
        source: 'Infosys Careers'
      },
      {
        externalId: 'india-zoho-chn-01',
        company: 'Zoho Corporation',
        logoUrl: 'https://ui-avatars.com/api/?name=Zoho&background=dc2626&color=fff',
        title: 'Member Technical Staff - Software Developer',
        location: 'Chennai / Tenkasi, Tamil Nadu, India',
        experienceLevel: 'Fresher (0-1 Yrs)',
        companyType: 'Product',
        postedDate: subDays(2),
        applyUrl: 'https://www.zoho.com/careers/',
        source: 'Zoho Careers'
      }
    ];

    return indiaJobs.map(job => this.normalizeJob(job));
  }
}

module.exports = IndiaTechAdapter;
