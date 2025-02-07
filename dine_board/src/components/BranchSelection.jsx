import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import './BranchSelection.css';

const BranchSelection = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/api/branch`);
        console.log(`${config.API_BASE_URL}/api/branch`)
        setBranches(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load branches. Please try again.');
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleBranchSelect = (branch) => {
    // Store branch information in localStorage
    localStorage.setItem('branchId', branch.id);
    localStorage.setItem('branchName', branch.name);
    localStorage.setItem('branchCode', branch.code);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  if (loading) return <div className="loading">Loading branches...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="branch-selection">
      <h1>Select Branch</h1>
      <div className="branches-grid">
        {branches.map(branch => (
          <div 
            key={branch.id} 
            className="branch-card"
            onClick={() => handleBranchSelect(branch)}
          >
            <h2>{branch.name}</h2>
            <p className="branch-code">Code: {branch.code}</p>
            <p className="branch-address">{branch.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchSelection; 