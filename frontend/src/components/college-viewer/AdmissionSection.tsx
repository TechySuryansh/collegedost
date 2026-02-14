import React from 'react';
import {
    FaCalendarAlt, FaClipboardList, FaFileAlt, FaCheckCircle
} from 'react-icons/fa';
import { CollegeData } from './types';

interface AdmissionSectionProps {
    college: CollegeData;
    sectionRef: React.RefObject<HTMLDivElement | null>;
}

const AdmissionSection: React.FC<AdmissionSectionProps> = ({ college, sectionRef }) => {
    return (
        <div
            ref={sectionRef}
            id="admission"
            className="bg-surface-light rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 transition-colors duration-300"
        >
            <h2 className="text-xl lg:text-2xl font-display font-bold text-text-main-light mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-linear-to-b from-primary to-blue-500 rounded-full"></span>
                Admissions
            </h2>

            {/* Cutoffs Section */}
            {college.cutoffs && college.cutoffs.length > 0 && (
                <div className="mb-10">
                    <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Expected Cutoffs 2024
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-text-muted-light font-bold">
                                <tr>
                                    <th className="p-4">Rank Category</th>
                                    <th className="p-4">Exam</th>
                                    <th className="p-4">Closing Rank</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {college.cutoffs.map((cutoff, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="p-4 font-medium">{cutoff.branch} ({cutoff.category})</td>
                                        <td className="p-4">{cutoff.exam}</td>
                                        <td className="p-4 font-bold text-primary">{cutoff.closingRank}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Important Dates */}
            <div className="mb-8">
                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-primary" /> Important Dates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {college.importantDates && college.importantDates.length > 0 ? (
                        college.importantDates.map((date, idx) => {
                            let colorClass = "bg-blue-50 border-blue-100 text-blue-600";
                            if (date.status === 'ongoing') colorClass = "bg-green-50 border-green-100 text-green-600";
                            if (date.status === 'completed') colorClass = "bg-gray-50 border-gray-100 text-gray-600";
                            if (date.status === 'upcoming') colorClass = "bg-orange-50 border-orange-100 text-orange-600";

                            return (
                                <div key={idx} className={`${colorClass.split(' ').slice(0, 2).join(' ')} rounded-xl p-4`}>
                                    <div className={`text-xs ${colorClass.split(' ')[2]} font-medium uppercase tracking-wide mb-1`}>
                                        {date.event}
                                    </div>
                                    <div className="font-bold text-text-main-light">{date.date}</div>
                                </div>
                            );
                        })
                    ) : (
                        <>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <div className="text-xs text-blue-600 font-medium uppercase tracking-wide mb-1">Application Opens</div>
                                <div className="font-bold text-text-main-light">January 2026</div>
                            </div>
                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">Application Deadline</div>
                                <div className="font-bold text-text-main-light">March 2026</div>
                            </div>
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <div className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">Entrance Exam</div>
                                <div className="font-bold text-text-main-light">April 2026</div>
                            </div>
                            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                                <div className="text-xs text-purple-600 font-medium uppercase tracking-wide mb-1">Counselling Starts</div>
                                <div className="font-bold text-text-main-light">June 2026</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Admission Process */}
            <div className="mb-8">
                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                    <FaClipboardList className="text-primary" /> Admission Process
                </h3>
                <div className="space-y-4">
                    {(college.admissionProcess && college.admissionProcess.length > 0 ? (
                        college.admissionProcess
                    ) : (
                        [
                            { step: 1, title: 'Register Online', description: 'Create an account on the official admission portal' },
                            { step: 2, title: 'Fill Application Form', description: 'Complete the application with personal & academic details' },
                            { step: 3, title: 'Appear for Entrance Exam', description: 'Take the required entrance examination (JEE/CAT/GATE)' },
                            { step: 4, title: 'Document Verification', description: 'Submit required documents for verification' },
                            { step: 5, title: 'Counselling & Seat Allotment', description: 'Participate in counselling and accept seat offer' },
                        ]
                    )).map((item: any) => (
                        <div key={item.step} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main-light">{item.title}</h4>
                                <p className="text-sm text-text-muted-light">{item.description || item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Documents */}
            <div>
                <h3 className="font-bold text-lg text-text-main-light mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-primary" /> Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(college.requiredDocuments && college.requiredDocuments.length > 0 ? (
                        college.requiredDocuments
                    ) : (
                        [
                            '10th & 12th Marksheets',
                            'Entrance Exam Scorecard',
                            'Identity Proof (Aadhar/PAN)',
                            'Passport Size Photos',
                            'Category Certificate (if applicable)',
                            'Migration Certificate',
                            'Transfer Certificate',
                            'Gap Certificate (if applicable)'
                        ]
                    )).map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-text-muted-light">
                            <FaCheckCircle className="text-green-500" />
                            {doc}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdmissionSection;
