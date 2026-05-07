import { useNavigate } from 'react-router-dom';

export const useAdminDashboard = () => {
  const navigate = useNavigate();

  const handleStatClick = (label) => {
    console.log(`Stat clicked: ${label}`);
  };

  return {
    navigate,
    handleStatClick
  };
};
