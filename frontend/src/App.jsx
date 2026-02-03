import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AskModal from './components/AskModal';
import ShareModal from './components/ShareModal';
import AuthModal from './components/AuthModal';
import { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const EngineeringPage = lazy(() => import('./pages/EngineeringPage'));
const PharmacyPage = lazy(() => import('./pages/PharmacyPage'));
const LawPage = lazy(() => import('./pages/LawPage'));
const ManagementPage = lazy(() => import('./pages/ManagementPage'));
const MedicinePage = lazy(() => import('./pages/MedicinePage'));
const JEEMainPredictor = lazy(() => import('./pages/JEEMainPredictor'));
const JEEMainRankPredictor = lazy(() => import('./pages/JEEMainRankPredictor'));
const JEERankPredictor = lazy(() => import('./pages/JEERankPredictor'));
const NEETPredictor = lazy(() => import('./pages/NEETPredictor'));
const InternationalColleges = lazy(() => import('./pages/InternationalColleges'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const ExamDetailPage = lazy(() => import('./pages/ExamDetailPage'));
const CollegesPage = lazy(() => import('./pages/CollegesPage'));
const CollegeDetailPage = lazy(() => import('./pages/CollegeDetailPage'));
const CoursesPage = lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CollegePredictor = lazy(() => import('./pages/CollegePredictor'));
const GenericRankPredictor = lazy(() => import('./pages/GenericRankPredictor'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'));
const CompareColleges = lazy(() => import('./pages/CompareColleges'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminArticles = lazy(() => import('./pages/admin/AdminArticles'));
const PostArticle = lazy(() => import('./pages/admin/PostArticle'));
const AdminColleges = lazy(() => import('./pages/admin/AdminColleges'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AddCollege = lazy(() => import('./pages/admin/AddCollege'));
const AdminIngestion = lazy(() => import('./pages/admin/AdminIngestion'));
const PredictorSettings = lazy(() => import('./pages/admin/PredictorSettings'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AllCategoriesPage = lazy(() => import('./pages/AllCategoriesPage'));
const UniversitiesPage = lazy(() => import('./pages/UniversitiesPage'));
const DesignPage = lazy(() => import('./pages/DesignPage'));
const HospitalityPage = lazy(() => import('./pages/HospitalityPage'));
const MediaPage = lazy(() => import('./pages/MediaPage'));
const CommercePage = lazy(() => import('./pages/CommercePage'));
const SciencePage = lazy(() => import('./pages/SciencePage'));
const ArtsPage = lazy(() => import('./pages/ArtsPage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const ComputerPage = lazy(() => import('./pages/ComputerPage'));
const StudyAbroadPage = lazy(() => import('./pages/StudyAbroadPage'));
// ... (existing imports)
const TestPrepDetailPage = lazy(() => import('./pages/TestPrepDetailPage'));
const TestPrepViewPage = lazy(() => import('./pages/TestPrepViewPage'));





import { HelmetProvider } from 'react-helmet-async';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

import { useAuth } from './context/AuthContext';



function App() {
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
  


  // Simple loading spinner
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
    </div>
  );

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans relative">


          <Navbar
            onOpenAskModal={() => setIsAskModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onOpenAuthModal={openAuthModal}
          />

          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/engineering" element={<EngineeringPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/pharmacy" element={<PharmacyPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/law" element={<LawPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/management" element={<ManagementPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/medicine" element={<MedicinePage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/jee-main-predictor" element={<JEEMainPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/jee-main-rank-predictor" element={<JEEMainRankPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/international-colleges" element={<InternationalColleges />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/exams/:slug" element={<ExamDetailPage />} />
              <Route path="/colleges" element={<CollegesPage />} />
              <Route path="/colleges/:slug" element={<CollegeDetailPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:slug" element={<CourseDetailPage />} />
              <Route path="/predict-colleges" element={<CollegePredictor />} />
              <Route path="/jee-main-college-predictor" element={<JEEMainPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/jee-main-rank-predictor" element={<JEEMainRankPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/neet-predictor" element={<NEETPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/neet-college-predictor" element={<NEETPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/jee-rank-predictor" element={<JEERankPredictor onOpenAuthModal={openAuthModal} />} />
              <Route path="/rank-predictor" element={<GenericRankPredictor />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:slug" element={<NewsDetailPage />} />
              <Route path="/compare-colleges" element={<CompareColleges />} />
              
              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/articles" element={<AdminArticles />} />
                <Route path="/admin/articles/new" element={<PostArticle />} />
                <Route path="/admin/articles/edit/:id" element={<PostArticle />} />
                <Route path="/admin/colleges" element={<AdminColleges />} />
                <Route path="/admin/colleges/new" element={<AddCollege />} />
                <Route path="/admin/colleges/edit/:id" element={<AddCollege />} />
                <Route path="/admin/ingestion" element={<AdminIngestion />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/predictor-settings" element={<PredictorSettings />} />
              </Route>

              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="/categories" element={<AllCategoriesPage />} />
              <Route path="/universities" element={<UniversitiesPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/design" element={<DesignPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/hospitality" element={<HospitalityPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/media" element={<MediaPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/commerce" element={<CommercePage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/science" element={<SciencePage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/arts" element={<ArtsPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/education" element={<EducationPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/computer-applications" element={<ComputerPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
              <Route path="/test-prep/:stream/:exam/:type" element={<TestPrepDetailPage />} />
              <Route path="/test-prep/view/:slug" element={<TestPrepViewPage />} />
              <Route path="/study-abroad" element={<StudyAbroadPage onOpenAskModal={() => setIsAskModalOpen(true)} />} />
            </Routes>
          </Suspense>

          <Footer />
          <AskModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />
          <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
          <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
