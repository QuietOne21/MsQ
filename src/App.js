import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

// Authentication Context - Global State management for auth
const AuthContext = createContext(null);

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext); // Get context value
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component - Manages global auth state
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current user object
  const [loading, setLoading] = useState(true); // Loading state for async operations
  const [token, setToken] = useState(localStorage.getItem('token')); // JWT token from localStorage

  // API base URL - centralized configuration
  const API_BASE_URL = 'http://localhost:5000/api';

  // Initialize authentication on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token'); // Get token from localStorage
      if (storedToken) {
        try {
          // Verify token by fetching user profile - http request
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`, // Include auth header
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json(); // Parse JSON response
            setUser(data.user); // Set current user
            setToken(storedToken); // Set token state
          } else {
            localStorage.removeItem('token'); // Remove invalid token
            setToken(null); // Clear token state
          }
        } catch (error) {
          console.error('Auth initialization error: ', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false); // Set loading complete
    };
    initializeAuth();
  }, []); // Empty dependency array - runs once on mount

  // Login Function
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      // Make API request
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Serialize request body
      });

      const data = await response.json(); // Parse response

      if (response.ok) {
        // Login successful
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token); // Store token persistently
        return { success: true, message: data.message };
      } else {
        // Login failed
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, function is stable

  // Register Function
  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      // Make registration API request
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        // Registration Successful
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.token);
        return { success: true, message: data.message };
      } else {
        // Registration failed
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      if (token) {
        // Make logout API request
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  }, [token]); // Depends on token

  // Context value object
  const contextValue = {
    user, // Current user object
    loading, // Loading state
    token, // JWT token
    login, // Login function
    register, // Register function
    logout, // Logout function
    isAuthenticated: !!user // Boolean indicating if user is logged in
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Input Field Component with floating labels
const InputField = ({ type, value, onChange, label, required = false, error }) => {
  return (
    <div className="input-field">
      <input
        type={type} // Input Type
        value={value} // Controlled input value
        onChange={onChange} // Change handler function
        required={required} // HTML Validation
        className={error ? 'error' : ''} // Conditional CSS class
      />
      <label className={value ? 'active' : ''}>{label}</label>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

// Form validation utility functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/;
  return passwordRegex.test(password);
};

const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s\-']{1,50}$/;
  return nameRegex.test(name);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-()]{10,15}$/;
  return phoneRegex.test(phone);
};

// Login Form Component
const LoginForm = ({ onSwitchToRegister }) => {
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(''); // API error messages

  // Handle input changes with field-specific updates
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {}; // Object to store validation errors

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} id="loginForm">
        <h2>Login Form</h2>

        {submitError && (
          <div className="error-banner">
            {submitError}
          </div>
        )}

        {/* Email input field */}
        <InputField
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          label="Enter your email"
          required
          error={errors.email}
        />

        {/* Password input field */}
        <InputField
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          label="Enter your password"
          required
          error={errors.password}
        />

        {/* Forgot password link */}
        <div className="forget">
          <a href="#" onClick={(e) => { 
            e.preventDefault(); 
            alert('Forgot password functionality would be implemented here'); 
          }}>
            Forgot password?
          </a>
        </div>

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        {/* Register link */}
        <div className="register">
          <p>Don't have an account?
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              onSwitchToRegister(); 
            }}> Register</a>
          </p>
        </div>

        {/* Social media links */}
        <div className="social-platforms">
          <p>Check out our social media accounts</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="X" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

// Register form component
const RegisterForm = ({ onSwitchToLogin }) => {
  const { register, loading } = useAuth();

  // Form state using React hooks
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Error state for form validation
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Handle input changes
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  // Comprehensive form validation
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'First name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must contain only letters, spaces, hyphens, and apostrophes (1-50 chars)';
    }

    // Surname validation
    if (!formData.surname.trim()) {
      newErrors.surname = 'Last name is required';
    } else if (!validateName(formData.surname)) {
      newErrors.surname = 'Surname must contain only letters, spaces, hyphens, and apostrophes (1-50 chars)';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be 8-128 characters with uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Attempt registration via context function
    const result = await register(formData);
    if (!result.success) {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} id="signUpForm">
        <h2>Create Account</h2>
        {submitError && (
          <div className="error-banner">
            {submitError}
          </div>
        )}

        <InputField
          type="text"
          value={formData.name}
          onChange={handleInputChange('name')}
          label="Name"
          required
          error={errors.name}
        />

        <InputField
          type="text"
          value={formData.surname}
          onChange={handleInputChange('surname')}
          label="Surname"
          required
          error={errors.surname}
        />

        <InputField
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          label="Email"
          required
          error={errors.email}
        />

        <InputField
          type="tel"
          value={formData.phone}
          onChange={handleInputChange('phone')}
          label="Phone Number"
          required
          error={errors.phone}
        />

        <InputField
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          label="Create Password"
          required
          error={errors.password}
        />

        <InputField
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          label="Confirm Password"
          required
          error={errors.confirmPassword}
        />

        <div className="signIn">
          <p>Already have an account?
            <a href="#" onClick={(e) => { 
              e.preventDefault(); 
              onSwitchToLogin(); 
            }}>
              login
            </a>
          </p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

// Dashboard Component - Protected route for authenticated users
const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const [userProfile, setUserProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    phone: user?.phone || ''
  });

  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Handle profile update submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      // Make API request to update profile
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm) // Serialize form data
      });

      const data = await response.json();

      if (response.ok) {
        // Update successful
        setUserProfile(data.user); // Update local profile state
        setIsEditing(false); // Exit edit mode
        setUpdateSuccess('Profile updated successfully!');
        setUpdateError('');

        setTimeout(() => setUpdateSuccess(''), 3000);
      } else {
        setUpdateError(data.error);
        setUpdateSuccess('');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setUpdateError('Network error occurred');
      setUpdateSuccess('');
    }
  };

  // Handle edit form changes
  const handleEditChange = (field) => (e) => {
    const value = e.target.value; // Get input value
    setEditForm(prev => ({ ...prev, [field]: value })); // Update edit form

    if (updateError) setUpdateError('');
    if (updateSuccess) setUpdateSuccess('');
  };

  // Handle logout with async operation
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-container">
      <div className="wrapper dashboard-wrapper">
        <div className="dashboard-header">
          <h2>Welcome, {userProfile?.name || 'User'}!</h2>
          <button onClick={handleLogout} className="logout-btn" disabled={loading}>
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {updateError && <div className="error-banner">{updateError}</div>}
        {updateSuccess && <div className="success-banner">{updateSuccess}</div>}

        {!isEditing ? (
          <div className="profile-info">
            <h3>Profile Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{userProfile?.name}</span>
              </div>
              <div className="info-item">
                <label>Surname:</label>
                <span>{userProfile?.surname}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{userProfile?.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{userProfile?.phone}</span>
              </div>
              <div className="info-item">
                <label>Member since:</label>
                <span>{new Date(userProfile?.createdAt).toLocaleDateString()}</span>
              </div>
              {userProfile?.lastLogin && (
                <div className="info-item">
                  <label>Last login:</label>
                  <span>{new Date(userProfile.lastLogin).toLocaleString()}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="edit-btn"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile} className="edit-form">
            <h3>Edit Profile</h3>

            <InputField
              type="text"
              value={editForm.name}
              onChange={handleEditChange('name')}
              label="Name"
              required
            />

            <InputField
              type="text"
              value={editForm.surname}
              onChange={handleEditChange('surname')}
              label="Surname"
              required
            />

            <InputField
              type="tel"
              value={editForm.phone}
              onChange={handleEditChange('phone')}
              label="Phone Number"
              required
            />

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    name: userProfile?.name || '',
                    surname: userProfile?.surname || '',
                    phone: userProfile?.phone || ''
                  });
                  setUpdateError('');
                  setUpdateSuccess('');
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Auth Content Component - Handles view switching based on auth state
const AuthContent = ({ currentView, setCurrentView }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner during auth operations
  if (loading) {
    return (
      <div className="wrapper">
        <div style={{ padding: '40px', textAlign: 'center', color: '#ffffff' }}>
          Loading...
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Show login or register form based on current view
  return currentView === 'login' ? (
    <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
  ) : (
    <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
  );
};

// Main App Component - Root component with routing logic
const App = () => {
  const [currentView, setCurrentView] = useState('login'); // View state: 'login' or 'register'

  return (
    <AuthProvider>
      <div className="app">
        {/* External CSS for Font Awesome icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />

        {/* Inline styles for complete component styling */}
        <style jsx>{`
          /* Import Google Fonts*/
          @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@200;300;400;500;600;700&display=swap");
          
          /* Global reset and base styles*/
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Open Sans", sans-serif;
          }
          
          /* Body styling with gradient background*/
          body, .app {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            width: 100%;
            padding: 20px;
            background: linear-gradient(135deg, #1e90ff 0%, #add8e6 100%);
            position: relative;
          }
          
          /* Glassmorphism card styling*/
          .wrapper {
            width: 500px;
            border-radius: 15px;
            padding: 40px;
            text-align: center;
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(5px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
            transition: all 0.3s ease;
          }
          
          /* Hover effects*/
          .wrapper:hover {
            box-shadow: 0 12px 48px rgba(255, 255, 255, 0.3);
            transform: translateY(-5px);
          }
          
          /* Form styling*/
          form {
            display: flex;
            flex-direction: column;
          }
          
          /* Heading styles*/
          h2, h3 {
            font-size: 2.2rem;
            margin-bottom: 25px;
            color: #ffffff;
            letter-spacing: 1px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
          
          h3 {
            font-size: 1.8rem;
            margin-bottom: 20px;
          }
          
          /* Input field styling*/
          .input-field {
            position: relative;
            border-bottom: 2px solid rgba(255, 255, 255, 0.6);
            margin: 15px 0;
          }
          
          .input-field label {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            color: #ffffff;
            font-size: 16px;
            pointer-events: none;
            transition: 0.3s ease;
          }
          
          .input-field input {
            width: 100%;
            height: 40px;
            background: transparent;
            border: none;
            outline: none;
            font-size: 16px;
            color: #ffffff;
            padding: 0 10px;
          }
          
          .input-field input::placeholder {
            color: rgba(255, 255, 255, 0.7);
          }
          
          /* Floating label animation*/
          .input-field input:focus ~ label,
          .input-field input:valid ~ label,
          .input-field label.active {
            font-size: 0.9rem;
            top: 10px;
            transform: translateY(-150%);
            color: #ffffff;
          }
          
          .input-field input:focus {
            border-bottom-color: #ffffff;
          }
          
          /* Error styling*/
          .input-field.error input {
            border-bottom-color: #ff6b6b;
          }
          
          .error-message {
            color: #ff6b6b;
            font-size: 0.8rem;
            margin-top: 5px;
            display: block;
            text-align: left;
          }
          
          .error-banner {
            background: rgba(255, 107, 107, 0.2);
            border: 1px solid rgba(255, 107, 107, 0.5);
            color: #ffffff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .success-banner {
            background: rgba(46, 204, 113, 0.2);
            border: 1px solid rgba(46, 204, 113, 0.5);
            color: #ffffff;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          /* Button styling*/
          button {
            position: relative;
            width: 100%;
            height: 40px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1rem;
            color: #ffffff;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            margin-top: 10px;
          }
          
          button:hover:not(:disabled) {
            background: #002147;
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
          }
          
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
          
          /* Link styling*/
          .forget, .register, .signIn {
            margin: 15px 0;
          }
          
          .forget a, .register a, .signIn a {
            color: #ffffff;
            text-decoration: none;
            transition: all 0.3s ease;
            margin-left: 5px;
          }
          
          .forget a:hover, .register a:hover, .signIn a:hover {
            text-decoration: underline;
            color: #add8e6;
          }
          
          .register p, .signIn p {
            color: #ffffff;
          }
          
          /* Social media styling*/
          .social-platforms {
            margin-top: 30px;
          }
          
          .social-platforms p {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 15px;
            font-size: 0.9rem;
          }
          
          .social-icons {
            display: flex;
            justify-content: center;
            gap: 15px;
          }
          
          .social-icons a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            color: #ffffff;
            text-decoration: none;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            font-size: 18px;
            position: relative;
            overflow: hidden;
          }
          
          .social-icons a:hover {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15));
            border-color: rgba(255, 255, 255, 0.6);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4);
            color: #ffffff;
          }
          
          /* Dashboard specific styling*/
          .dashboard-container {
            width: 100%;
            max-width: 800px;
          }
          
          .dashboard-wrapper {
            width: 100%;
            max-width: none;
            text-align: left;
          }
          
          .dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
          }
          
          .logout-btn {
            width: auto;
            padding: 10px 20px;
            height: auto;
          }
          
          .profile-info {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 25px;
            margin-bottom: 20px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 25px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          
          .info-item label {
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.9rem;
          }
          
          .info-item span {
            color: #ffffff;
            font-size: 1rem;
          }
          
          .edit-btn, .save-btn, .cancel-btn {
            width: auto;
            padding: 10px 20px;
            height: auto;
            margin: 5px;
          }
          
          .edit-form {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 25px;
          }
          
          .form-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
          
          .cancel-btn {
            background: rgba(255, 107, 107, 0.3);
          }
          
          .cancel-btn:hover:not(:disabled) {
            background: rgba(255, 107, 107, 0.5);
          }
          
          /* Responsive design */
          @media (max-width: 480px) {
            .wrapper {
              width: 90%;
              padding: 30px;
            }
            
            h2 {
              font-size: 1.8rem;
            }
            
            .social-icons {
              gap: 10px;
            }
            
            .social-icons a {
              width: 42px;
              height: 42px;
              font-size: 16px;
            }
            
            .dashboard-header {
              flex-direction: column;
              text-align: center;
            }
            
            .info-grid {
              grid-template-columns: 1fr;
            }
            
            .form-actions {
              flex-direction: column;
            }
            
            .edit-btn, .save-btn, .cancel-btn {
              width: 100%;
            }
          }
        `}</style>

        {/* Conditional rendering based on authentication state*/}
        <AuthContent currentView={currentView} setCurrentView={setCurrentView} />
      </div>
    </AuthProvider>
  );
};

export default App;
