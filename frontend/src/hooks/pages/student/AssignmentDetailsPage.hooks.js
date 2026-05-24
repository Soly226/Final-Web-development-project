import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { assignmentsData, statusConfig } from '../../../data/pages/student/AssignmentDetailsPage.data';

export const useAssignmentDetails = () => {
  const { id } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');

  const assignment = assignmentsData[id] || assignmentsData[1];
  const statusCfg = statusConfig[submitted ? 'submitted' : assignment.status];

  const handleSubmit = () => {
    if (link.trim()) {
      setSubmitted(true);
    }
  };

  return {
    assignment,
    statusCfg,
    submitted,
    link,
    setLink,
    note,
    setNote,
    handleSubmit
  };
};
