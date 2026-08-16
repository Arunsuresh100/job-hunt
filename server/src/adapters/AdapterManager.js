const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const IndiaTechAdapter = require('./IndiaTechAdapter');
const RemotiveAdapter = require('./RemotiveAdapter');
const JobicyAdapter = require('./JobicyAdapter');
const ArbeitnowAdapter = require('./ArbeitnowAdapter');
const AdzunaAdapter = require('./AdzunaAdapter');
const JSearchAdapter = require('./JSearchAdapter');

class AdapterManager {
  constructor() {
    this.adapters = [];
    this.registerDefaults();
  }

  registerDefaults() {
    this.registerAdapter(new IndiaTechAdapter());
    this.registerAdapter(new RemotiveAdapter());
    this.registerAdapter(new JobicyAdapter());
    this.registerAdapter(new AdzunaAdapter());
    this.registerAdapter(new JSearchAdapter());
  }

  registerAdapter(adapter) {
    this.adapters.push(adapter);
    console.log(`[AdapterManager] Registered adapter: ${adapter.name}`);
  }

  /**
   * Run sync across all registered adapters
   */
  async syncAll() {
    console.log('[AdapterManager] Starting global job sync process...');
    let totalAdded = 0;
    let totalUpdated = 0;
    const errors = [];

    for (const adapter of this.adapters) {

      try {
        console.log(`[AdapterManager] Syncing from ${adapter.name}...`);
        const jobs = await adapter.fetchJobs({ limit: 25 });
        
        for (const job of jobs) {
          // Check existing by externalId or composite title+company
          const matchConditions = [];
          if (job.externalId) {
            matchConditions.push({ externalId: job.externalId });
          }
          if (job.title && job.company) {
            matchConditions.push({ AND: [{ title: job.title }, { company: job.company }] });
          }

          const existing = matchConditions.length > 0
            ? await prisma.job.findFirst({ where: { OR: matchConditions } })
            : null;

          // Check if older than 7 days from current date
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const isOlderThan7Days = job.postedDate < sevenDaysAgo;

          if (existing) {
            await prisma.job.update({
              where: { id: existing.id },
              data: {
                location: job.location,
                applyUrl: job.applyUrl,
                logoUrl: job.logoUrl || existing.logoUrl,
                companyType: job.companyType || 'Product',
                country: job.country || 'Worldwide',
                experienceLevel: job.experienceLevel,
                state: job.state || null,
                district: job.district || null,
                isArchived: isOlderThan7Days
              }
            });
            totalUpdated++;
          } else {
            await prisma.job.create({
              data: {
                externalId: job.externalId,
                company: job.company,
                logoUrl: job.logoUrl,
                title: job.title,
                location: job.location,
                experienceLevel: job.experienceLevel,
                companyType: job.companyType || 'Product',
                country: job.country || 'Worldwide',
                state: job.state || null,
                district: job.district || null,
                postedDate: job.postedDate,
                applyUrl: job.applyUrl,
                source: job.source,
                isArchived: isOlderThan7Days
              }
            });
            totalAdded++;
          }
        }

        // Update source telemetry
        await prisma.jobSource.upsert({
          where: { name: adapter.name },
          create: { name: adapter.name, syncCount: jobs.length, lastSyncAt: new Date() },
          update: { syncCount: jobs.length, lastSyncAt: new Date() }
        });
      } catch (err) {
        console.error(`[AdapterManager] Error running adapter ${adapter.name}:`, err.message);
        errors.push({ adapter: adapter.name, error: err.message });
      }
    }

    // Sanitize and reclassify all existing jobs in DB with current classifiers
    await this.reclassifyExistingJobs();

    // Auto-Archive step: Mark any job in DB older than 7 days as archived
    const archiveResult = await this.autoArchiveOlderJobs();

    console.log(`[AdapterManager] Sync completed! Added: ${totalAdded}, Updated: ${totalUpdated}, Archived: ${archiveResult.count}`);
    return {
      success: true,
      totalAdded,
      totalUpdated,
      archivedCount: archiveResult.count,
      errors,
      syncedAt: new Date()
    };
  }

  /**
   * Re-evaluates country, state, district, and experienceLevel for all existing DB rows
   */
  async reclassifyExistingJobs() {
    const { classifyLocation } = require('../utils/locationClassifier');
    const { classifyRole } = require('../utils/roleClassifier');

    const allJobs = await prisma.job.findMany();
    for (const job of allJobs) {
      const locMeta = classifyLocation(job.location, job.title);
      const roleMeta = classifyRole(job.title);

      await prisma.job.update({
        where: { id: job.id },
        data: {
          country: locMeta.country,
          state: locMeta.state,
          district: locMeta.district,
          experienceLevel: roleMeta.experienceLevel
        }
      });
    }
  }

  /**
   * Hard Filter Auto-Archiver: Marks jobs older than 7 days as archived
   */
  async autoArchiveOlderJobs() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return await prisma.job.updateMany({
      where: {
        postedDate: { lt: sevenDaysAgo },
        isArchived: false
      },
      data: {
        isArchived: true
      }
    });
  }
}

module.exports = new AdapterManager();
