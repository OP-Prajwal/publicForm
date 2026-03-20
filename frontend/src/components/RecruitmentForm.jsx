import React, { useState, useEffect } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import './RecruitmentForm.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const RecruitmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    token: '',
    captchaToken: ''
  });
  
  const [status, setStatus] = useState('fetching_token'); // fetching_token, idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const branches = ["CSE", "ISE", "ECE", "EEE", "ME", "CIVIL", "OTHER"];

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/form/token`);
        if (!response.ok) throw new Error('Failed to fetch security token');
        const data = await response.json();
        if (data.token) {
          setFormData(prev => ({ ...prev, token: data.token }));
          setStatus('idle');
        } else {
          throw new Error('Token missing from response');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        setStatus('error');
        setErrorMessage('Could not initialize security token. Please check backend connection and refresh.');
      }
    };
    fetchToken();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        idempotencyKey: window.crypto && window.crypto.randomUUID 
          ? window.crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      };

      const response = await fetch(`${API_BASE_URL}/api/form/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setStatus('success');
      setFormData({ name: '', email: '', branch: '', token: formData.token, captchaToken: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  if (status === 'fetching_token') {
    return (
      <div className="form-wrapper">
        <div className="form-container glass-panel">
          <h2 className="form-title">Join Nucleus</h2>
          <p className="form-subtitle">Loading secure session... Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-wrapper">
      <div className="form-container glass-panel">
        <h2 className="form-title">Join Nucleus</h2>
        <p className="form-subtitle">Submit your details to start the recruitment process.</p>
        
        {status === 'success' && (
          <div className="alert success-alert">
            Application submitted successfully! Keep an eye on your email.
          </div>
        )}
        
        {status === 'error' && (
          <div className="alert error-alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="recruitment-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required 
              minLength="2"
              maxLength="100"
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="branch">Branch</label>
            <div className="select-wrapper">
              <select 
                id="branch" 
                name="branch" 
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select your branch</option>
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group" style={{ alignItems: 'center', marginBottom: '1.5rem' }}>
            <Turnstile
              siteKey="1x00000000000000000000AA"
              onSuccess={(token) => setFormData(prev => ({ ...prev, captchaToken: token }))}
            />
          </div>

          <button 
            type="submit" 
            className={`submit-btn ${status === 'loading' ? 'loading' : ''}`}
            disabled={status === 'loading' || !formData.captchaToken}
          >
            {status === 'loading' ? 'Submitting...' : 'Apply Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecruitmentForm;
