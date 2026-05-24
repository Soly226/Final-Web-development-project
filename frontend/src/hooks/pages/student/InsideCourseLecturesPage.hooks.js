import { useParams } from 'react-router-dom';

export const useInsideCourseLectures = () => {
  const { id } = useParams();

  const handleLectureClick = (lectureId) => {
    alert(`Opening lecture #${lectureId}`);
  };

  return {
    id,
    handleLectureClick
  };
};
