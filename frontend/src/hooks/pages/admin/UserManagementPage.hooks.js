import { useState } from 'react';
import { initialUsers } from '../../../data/pages/admin/UserManagementPage.data';

export const useUserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
      id: Date.now(),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      status: formData.get('status'),
      joined: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setEditingUser(null);
  };
  
  const handleEditUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (editingUser) {
        setUsers(users.map(u => u.id === editingUser.id ? { 
            ...u, 
            name: formData.get('name'), 
            email: formData.get('email'), 
            role: formData.get('role'), 
            status: formData.get('status') 
        } : u));
        setIsModalOpen(false);
        setEditingUser(null);
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return {
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    isModalOpen,
    setIsModalOpen,
    editingUser,
    setEditingUser,
    filteredUsers,
    handleDelete,
    handleAddUser,
    handleEditUser,
    openEditModal
  };
};
