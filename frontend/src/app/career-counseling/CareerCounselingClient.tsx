'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGraduationCap,
  FaBrain,
  FaRocket,
  FaChartLine,
  FaUniversity,
  FaLightbulb,
  FaBriefcase,
  FaRupeeSign,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaStar,
  FaMapMarkerAlt,
  FaBookOpen,
  FaClipboardList,
  FaDownload,
} from 'react-icons/fa';
import {
  HiAcademicCap,
  HiSparkles,
  HiClipboardDocumentList,
} from 'react-icons/hi2';
import api from '@/api/axios';

// ─── Types ───────────────────────────────────────────────────

interface StudentFormData {
  fullName: string;
  dateOfBirth: string;
  currentClass: string;
  board: string;
  stream: string;
  subjects: string;
  exams: string[];
  preferredLocation: string;
  preferredColleges: string;
  preferredLanguage: string;
  interests: string[];
}

interface CareerPath {
  rank: number;
  title: string;
  match: string; // "Excellent" | "Good" | "Fair"
  description: string;
  roadmap: string[];
  entranceExams: string[];
  degreeOptions: string[];
  topColleges: { name: string; location: string }[];
  skills: string[];
  roles: string[];
  salaryRange: string;
}

interface CareerReport {
  studentSummary: string;
  careerPaths: CareerPath[];
  finalRecommendation: string;
}

// ─── Constants ───────────────────────────────────────────────

const CLASS_OPTIONS = ['Class 10', 'Class 11', 'Class 12', 'Dropper'];
const BOARD_OPTIONS = ['CBSE', 'ICSE', 'State Board', 'Other'];
const STREAM_OPTIONS = ['PCM (Science)', 'PCB (Science)', 'Commerce', 'Arts / Humanities', 'Other'];
const EXAM_OPTIONS = ['JEE Main', 'JEE Advanced', 'NEET', 'CUET', 'MHT CET', 'BITSAT', 'VITEEE', 'None'];
const LANGUAGE_OPTIONS = ['Hindi', 'English', 'Both'];
const INTEREST_OPTIONS = [
  { label: 'Technology', icon: '💻' },
  { label: 'Business', icon: '📊' },
  { label: 'Finance', icon: '💰' },
  { label: 'Medicine', icon: '🏥' },
  { label: 'Research', icon: '🔬' },
  { label: 'Government Jobs', icon: '🏛️' },
  { label: 'Creative Fields', icon: '🎨' },
  { label: 'Not Sure', icon: '🤔' },
];

const FORM_STEPS = [
  { id: 'personal', label: 'Personal', icon: FaGraduationCap },
  { id: 'academic', label: 'Academic', icon: HiAcademicCap },
  { id: 'exams', label: 'Exams', icon: HiClipboardDocumentList },
  { id: 'preferences', label: 'Preferences', icon: FaMapMarkerAlt },
  { id: 'interests', label: 'Interests', icon: FaLightbulb },
];

// ─── Helper Components ──────────────────────────────────────

function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: typeof FORM_STEPS;
  currentStep: number;
  onStepClick: (idx: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentStep;
        const isCompleted = idx < currentStep;
        return (
          <React.Fragment key={step.id}>
            <button
              type="button"
              onClick={() => onStepClick(idx)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 group ${
                isActive
                  ? 'scale-110'
                  : isCompleted
                  ? 'opacity-80 hover:opacity-100'
                  : 'opacity-40'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : isCompleted
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <FaCheckCircle className="text-lg" /> : <Icon className="text-lg" />}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </button>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-all duration-300 ${
                  idx < currentStep ? 'bg-green-300' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SelectChip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
        selected
          ? 'border-primary bg-primary/10 text-primary shadow-sm'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </button>
  );
}

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-text-main-light">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-text-main-light placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-text-main-light">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-text-main-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Match badge color ──────────────────────────────────────

function matchColor(match: string) {
  switch (match) {
    case 'Excellent':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Good':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default:
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  }
}

// ─── Main Component ─────────────────────────────────────────

export default function CareerCounselingClient() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: '',
    dateOfBirth: '',
    currentClass: '',
    board: '',
    stream: '',
    subjects: '',
    exams: [],
    preferredLocation: '',
    preferredColleges: '',
    preferredLanguage: '',
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CareerReport | null>(null);
  const [error, setError] = useState('');
  const reportRef = useRef<HTMLDivElement>(null);

  // ── Form data updaters ──
  const updateField = <K extends keyof StudentFormData>(key: K, value: StudentFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'exams' | 'interests', item: string) => {
    setFormData((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      };
    });
  };

  // ── Validation ──
  const isStepValid = (s: number): boolean => {
    switch (s) {
      case 0:
        return formData.fullName.trim().length > 0;
      case 1:
        return formData.currentClass !== '' && formData.board !== '' && formData.stream !== '';
      case 2:
        return formData.exams.length > 0;
      case 3:
        return true; // preferences are optional
      case 4:
        return formData.interests.length > 0;
      default:
        return true;
    }
  };

  // ── Navigation ──
  const goNext = () => {
    if (step < FORM_STEPS.length - 1 && isStepValid(step)) {
      setStep(step + 1);
    }
  };
  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };
  const goToStep = (idx: number) => {
    // Only allow visiting completed steps or current step
    if (idx <= step) setStep(idx);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!isStepValid(step)) return;
    setLoading(true);
    setError('');
    setReport(null);

    try {
      const res = await api.post('/career-counseling/generate', formData, { timeout: 120000 });
      if (res.data.success) {
        setReport(res.data.data);
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        setError(res.data.message || 'Failed to generate report. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Career counseling error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render form step ──
  const renderStep = () => {
    const variants = {
      enter: { opacity: 0, x: 30 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -30 },
    };

    switch (step) {
      case 0:
        return (
          <motion.div key="step-0" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
            <h3 className="text-lg font-bold text-text-main-light flex items-center gap-2">
              <FaGraduationCap className="text-primary" /> Personal Information
            </h3>
            <p className="text-sm text-text-muted-light">Tell us a little about yourself so we can personalize your career guidance.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InputField label="Full Name" value={formData.fullName} onChange={(v) => updateField('fullName', v)} placeholder="e.g. Rahul Sharma" required />
              <InputField label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={(v) => updateField('dateOfBirth', v)} />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="step-1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
            <h3 className="text-lg font-bold text-text-main-light flex items-center gap-2">
              <HiAcademicCap className="text-primary" /> Academic Information
            </h3>
            <p className="text-sm text-text-muted-light">Your academic background helps us recommend the right career paths.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SelectField label="Current Class" value={formData.currentClass} onChange={(v) => updateField('currentClass', v)} options={CLASS_OPTIONS} required />
              <SelectField label="Board" value={formData.board} onChange={(v) => updateField('board', v)} options={BOARD_OPTIONS} required />
            </div>
            <SelectField label="Stream" value={formData.stream} onChange={(v) => updateField('stream', v)} options={STREAM_OPTIONS} required />
            <InputField label="Subjects (comma-separated)" value={formData.subjects} onChange={(v) => updateField('subjects', v)} placeholder="e.g. Physics, Chemistry, Mathematics" />
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step-2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
            <h3 className="text-lg font-bold text-text-main-light flex items-center gap-2">
              <HiClipboardDocumentList className="text-primary" /> Entrance Exams
            </h3>
            <p className="text-sm text-text-muted-light">Select all the exams you are appearing for or planning to take.</p>
            <div className="flex flex-wrap gap-3">
              {EXAM_OPTIONS.map((exam) => (
                <SelectChip key={exam} label={exam} selected={formData.exams.includes(exam)} onClick={() => toggleArrayItem('exams', exam)} />
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step-3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
            <h3 className="text-lg font-bold text-text-main-light flex items-center gap-2">
              <FaMapMarkerAlt className="text-primary" /> Preferences
            </h3>
            <p className="text-sm text-text-muted-light">Optional preferences to fine-tune your recommendations.</p>
            <InputField label="Preferred Study Location" value={formData.preferredLocation} onChange={(v) => updateField('preferredLocation', v)} placeholder="e.g. Mumbai, Maharashtra" />
            <InputField label="Preferred Colleges (optional)" value={formData.preferredColleges} onChange={(v) => updateField('preferredColleges', v)} placeholder="e.g. IIT Bombay, NIT Trichy" />
            <SelectField label="Preferred Language" value={formData.preferredLanguage} onChange={(v) => updateField('preferredLanguage', v)} options={LANGUAGE_OPTIONS} />
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="step-4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-5">
            <h3 className="text-lg font-bold text-text-main-light flex items-center gap-2">
              <FaLightbulb className="text-primary" /> Your Interests
            </h3>
            <p className="text-sm text-text-muted-light">Select all areas that interest you. This helps us match you with the right careers.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INTEREST_OPTIONS.map((interest) => (
                <SelectChip
                  key={interest.label}
                  label={interest.label}
                  icon={interest.icon}
                  selected={formData.interests.includes(interest.label)}
                  onClick={() => toggleArrayItem('interests', interest.label)}
                />
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // ── Report Section ──
  const renderReport = () => {
    if (!report) return null;
    return (
      <motion.div ref={reportRef} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mt-16">
        {/* Report Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <HiSparkles className="text-base" /> AI Career Report Generated
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-text-main-light mb-3">
            Your Personalized Career Roadmap
          </h2>
          <p className="text-text-muted-light max-w-2xl mx-auto">
            Based on your profile, our AI has identified the best career paths for you. Explore each one in detail.
          </p>
        </div>

        {/* Student Summary Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-premium p-6 sm:p-8 mb-10">
          <h3 className="text-lg font-bold text-text-main-light flex items-center gap-2 mb-4">
            <FaClipboardList className="text-primary" /> Student Profile Summary
          </h3>
          <p className="text-text-muted-light leading-relaxed">{report.studentSummary}</p>
        </div>

        {/* Career Paths */}
        <div className="space-y-8">
          {report.careerPaths.map((path, idx) => (
            <CareerPathCard key={idx} path={path} index={idx} />
          ))}
        </div>

        {/* Final Recommendation */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 bg-linear-to-br from-primary/5 via-white to-secondary/5 rounded-2xl border border-primary/20 shadow-premium p-6 sm:p-8">
          <h3 className="text-xl font-bold text-text-main-light flex items-center gap-2 mb-4">
            <FaStar className="text-yellow-500" /> Final Recommendation
          </h3>
          <p className="text-text-muted-light leading-relaxed whitespace-pre-line">{report.finalRecommendation}</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <FaDownload /> Download Report
          </button>
          <button
            onClick={() => {
              setReport(null);
              setStep(0);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-text-main-light font-semibold hover:bg-gray-50 transition-all"
          >
            <FaArrowLeft /> Start New Assessment
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-linear-to-br from-brand-dark via-brand-dark-light to-brand-dark pt-28 pb-20">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-blob animation-delay-2000" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/10">
              <HiSparkles className="text-secondary" /> Powered by AI
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
              AI Career <span className="text-primary">Counseling</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Not sure what to do after Class 12? Let our AI analyze your profile, interests, and academic background to craft a personalized career roadmap — in seconds.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { value: '3', label: 'Career Paths' },
              { value: '50+', label: 'Top Colleges' },
              { value: '100%', label: 'Free' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 -mt-10 relative z-20 pb-20">
        {!report ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-premium border border-gray-100 p-6 sm:p-10">
            {/* Step Indicator */}
            <StepIndicator steps={FORM_STEPS} currentStep={step} onStepClick={goToStep} />

            {/* Form Steps */}
            <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

            {/* Error */}
            {error && (
              <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-text-muted-light hover:bg-gray-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <FaArrowLeft className="text-xs" /> Back
              </button>

              {step < FORM_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!isStepValid(step)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <FaArrowRight className="text-xs" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !isStepValid(step)}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-linear-to-r from-primary to-teal-600 text-white text-sm font-semibold hover:shadow-xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Generating Report...
                    </>
                  ) : (
                    <>
                      <FaRocket /> Generate Career Report
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        ) : null}

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaBrain className="text-2xl text-primary" />
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-text-main-light mb-2">
                  Analyzing Your Profile
                </h3>
                <p className="text-text-muted-light text-sm">
                  Our AI is crafting a personalized career roadmap just for you. This may take up to a minute...
                </p>
                <div className="mt-6 flex gap-1.5 justify-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report */}
        {renderReport()}
      </section>
    </div>
  );
}

// ─── Career Path Card ────────────────────────────────────────

function CareerPathCard({ path, index }: { path: CareerPath; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-premium overflow-hidden"
    >
      {/* Card Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 sm:p-8 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
            #{path.rank}
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main-light">{path.title}</h3>
            <span className={`inline-block mt-1 text-xs px-3 py-0.5 rounded-full border font-semibold ${matchColor(path.match)}`}>
              {path.match} Match
            </span>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 sm:px-8 pb-8 space-y-6 border-t border-gray-100 pt-6">
              {/* Description */}
              <p className="text-text-muted-light leading-relaxed">{path.description}</p>

              {/* Roadmap Timeline */}
              <div>
                <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-4">
                  <FaRocket className="text-primary" /> Step-by-Step Roadmap
                </h4>
                <div className="space-y-3 ml-4">
                  {path.roadmap.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="relative mt-1">
                        <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
                        {i < path.roadmap.length - 1 && <div className="absolute left-1/2 -translate-x-1/2 top-3 w-0.5 h-6 bg-gray-200" />}
                      </div>
                      <p className="text-sm text-text-muted-light">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Entrance Exams */}
                <div className="bg-blue-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-3">
                    <FaBookOpen className="text-blue-500" /> Entrance Exams
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.entranceExams.map((e) => (
                      <span key={e} className="text-xs px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 font-medium">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Degree Options */}
                <div className="bg-purple-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-3">
                    <HiAcademicCap className="text-purple-500" /> Degree Options
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.degreeOptions.map((d) => (
                      <span key={d} className="text-xs px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 font-medium">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-green-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-3">
                    <FaChartLine className="text-green-500" /> Skills to Develop
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.skills.map((s) => (
                      <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-green-100 text-green-700 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary */}
                <div className="bg-amber-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-3">
                    <FaRupeeSign className="text-amber-600" /> Salary Expectation
                  </h4>
                  <p className="text-sm font-semibold text-amber-700">{path.salaryRange}</p>
                </div>
              </div>

              {/* Top Colleges */}
              <div>
                <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-4">
                  <FaUniversity className="text-primary" /> Top Colleges
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {path.topColleges.map((college, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-main-light">{college.name}</p>
                        <p className="text-xs text-text-muted-light flex items-center gap-1">
                          <FaMapMarkerAlt className="text-[10px]" /> {college.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Roles */}
              <div>
                <h4 className="text-sm font-bold text-text-main-light flex items-center gap-2 mb-3">
                  <FaBriefcase className="text-primary" /> Career Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {path.roles.map((r) => (
                    <span key={r} className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-text-main-light font-medium border border-gray-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
