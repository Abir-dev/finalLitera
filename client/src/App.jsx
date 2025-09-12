import { Routes, Route, Navigate } from "react-router-dom";
import RootLayout from "./layout/RootLayout.jsx";
import DashboardLayout from "./layout/DashboardLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import About from "./pages/About.jsx";
import Faq from "./pages/Faq.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Subscription from "./pages/Subscription.jsx";
import Live from "./pages/Live.jsx";
import Recordings from "./pages/Recordings.jsx";
import AlgoBridge from "./pages/AlgoBridge.jsx";
import Notifications from "./pages/Notifications.jsx";
import Profile from "./pages/Profile.jsx";
import Billing from "./pages/Billing.jsx";
import Logout from "./pages/Logout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SelectedCourse from "./pages/SelectedCouse.jsx";
import LaunchPad from "./pages/LaunchPad.jsx";
import LaunchPadDetails from "./pages/LaunchPadDetails.jsx";
import ExamDetails from "./pages/ExamDetails.jsx";
import TermsConditions from "./pages/TermsConditions.jsx";
import RefundPolicy from "./pages/RefundPolicy.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminStudents from "./pages/AdminStudents.jsx";
import AdminCourses from "./pages/AdminCourses.jsx";
import AdminCourseManagement from "./pages/AdminCourseManagement.jsx";
import AdminExams from "./pages/AdminExams.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="launchpad" element={<LaunchPad />} />
        <Route path="launchpad/details" element={<LaunchPadDetails />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<Faq />} />
        <Route path="terms-conditions" element={<TermsConditions />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="admin/login" element={<AdminLogin />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="live" element={<Live />} />
        <Route path="recordings" element={<Recordings />} />
        <Route path="algobridge" element={<AlgoBridge />} />
        <Route path="exam/:id" element={<ExamDetails />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="billing" element={<Billing />} />
        <Route path="logout" element={<Logout />} />
        <Route path="selected-course/:id" element={<SelectedCourse />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="courses" element={<AdminCourseManagement />} />
        <Route path="exams" element={<AdminExams />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
