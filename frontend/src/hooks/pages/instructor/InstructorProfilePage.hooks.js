import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useInstructorProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Profile details updated successfully!');
  };

  return {
    user,
    handleLogout,
    handleUpdateProfile
  };
};
