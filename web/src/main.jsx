import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import BusesPage from './pages/BusesPage';
import DashboardPage from './pages/DashboardPage';
import DriverAccountsPage from './pages/DriverAccountsPage';
import LoginPage from './pages/LoginPage';
import NotificationsPage from './pages/NotificationsPage';
import ParentAccountsPage from './pages/ParentAccountsPage';
import RoutesPage from './pages/RoutesPage';
import StudentsPage from './pages/StudentsPage';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="parents" element={<ParentAccountsPage />} />
          <Route path="drivers" element={<DriverAccountsPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="buses" element={<BusesPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
