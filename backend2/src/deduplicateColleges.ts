import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from './models/College';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

async function deduplicateColleges() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const allColleges = await College.find({}).lean();
    console.log(`Total colleges: ${allColleges.length}`);

    // Normalize name for comparison
    const normalize = (name: string) =>
        name.trim().toLowerCase().replace(/,/g, ' ').replace(/\s+/g, ' ').trim();

    // Group by normalized name
    const groups: Record<string, typeof allColleges> = {};
    for (const college of allColleges) {
        const key = normalize(college.name);
        if (!groups[key]) groups[key] = [];
        groups[key].push(college);
    }

    let removedCount = 0;
    const idsToRemove: string[] = [];

    for (const [normName, entries] of Object.entries(groups)) {
        if (entries.length <= 1) continue;

        // Score each entry — prefer ones with more data
        const scored = entries.map(e => {
            let score = 0;
            if (e.nirfRank && e.nirfRank > 0) score += 10;
            if (e.collegeType) score += 5;
            if (e.management) score += 5;
            if (e.institutionCategory) score += 5;
            if (e.aisheCode) score += 5;
            if (e.description && e.description.length > 50) score += 3;
            if (e.coursesOffered && e.coursesOffered.length > 0) score += 3;
            if (e.cutoffs && e.cutoffs.length > 0) score += 3;
            if (e.aiContent) score += 5;
            return { entry: e, score };
        });

        // Sort by score descending — keep the best one
        scored.sort((a, b) => b.score - a.score);

        const keep = scored[0].entry;
        const remove = scored.slice(1).map(s => s.entry);

        console.log(`\nDUPLICATE: "${normName}" (${entries.length} entries)`);
        console.log(`  KEEP: ${keep._id} (score: ${scored[0].score}) - ${keep.name}`);
        for (let i = 1; i < scored.length; i++) {
            console.log(`  REMOVE: ${scored[i].entry._id} (score: ${scored[i].score}) - ${scored[i].entry.name}`);
            idsToRemove.push(scored[i].entry._id.toString());
        }
        removedCount += remove.length;
    }

    if (idsToRemove.length > 0) {
        const result = await College.deleteMany({ _id: { $in: idsToRemove } });
        console.log(`\n✅ Removed ${result.deletedCount} duplicate entries`);
    } else {
        console.log('\nNo duplicates found');
    }

    const remaining = await College.countDocuments();
    console.log(`Remaining colleges: ${remaining}`);

    await mongoose.disconnect();
}

deduplicateColleges().catch(console.error);
