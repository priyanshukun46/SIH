import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/Home';
import { Dashboard } from '../pages/Dashboard';
import { SimulationPage } from '../pages/Simulation';
import { RobotsPage } from '../pages/Robots';
import { TasksPage } from '../pages/Tasks';
import { AnalyticsPage } from '../pages/Analytics';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/simulation',
    element: <SimulationPage />
  },
  {
    path: '/robots',
    element: <RobotsPage />
  },
  {
    path: '/tasks',
    element: <TasksPage />
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
