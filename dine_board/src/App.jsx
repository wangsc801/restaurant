import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BranchSelection from "./components/BranchSelection";
import Dashboard from "./components/Dashboard";
import RecentOrdersView from "./components/views/RecentOrdersView";
import CategoriesOrdersView from "./components/views/CategoriesOrdersView";
// import './i18n/i18n';
import "./index.css"; // Make sure to import the global styles

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const branchId = localStorage.getItem("branchId");
  if (!branchId) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App" style={{ width: "100%", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<BranchSelection />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/recent"
            element={
              <ProtectedRoute>
                <RecentOrdersView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/categories/:categories"
            element={
              <ProtectedRoute>
                <CategoriesOrdersView />
              </ProtectedRoute>
            }
          />
          <Route path="/categories-orders" element={<CategoriesOrdersView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
