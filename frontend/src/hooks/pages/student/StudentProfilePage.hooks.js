import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useStudentProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Mock Student');
  const [bio, setBio] = useState('Computer Science student passionate about building great software and learning cutting-edge technologies.');
  const [major, setMajor] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const gpa = 3.6;

  return {
    user,
    isEditing,
    setIsEditing,
    name,
    setName,
    bio,
    setBio,
    major,
    setMajor,
    year,
    setYear,
    handleLogout,
    gpa
  };
};
