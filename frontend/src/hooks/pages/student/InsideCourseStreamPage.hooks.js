import { useState } from 'react';
import { useParams } from 'react-router-dom';

export const useInsideCourseStream = () => {
  const { id } = useParams();
  const [postContent, setPostContent] = useState('');

  const handlePost = () => {
    if (!postContent.trim()) return;
    alert("Posting to stream: " + postContent);
    setPostContent('');
  };

  const handleAttach = () => {
    alert("Opening file picker...");
  };

  const handleLike = (postId) => {
    alert(`You liked post #${postId}`);
  };

  const handleComment = (postId) => {
    alert(`Opening comment thread for post #${postId}`);
  };

  const handleMoreOptions = (postId) => {
    alert(`Opening options for post #${postId}`);
  };

  return {
    id,
    postContent,
    setPostContent,
    handlePost,
    handleAttach,
    handleLike,
    handleComment,
    handleMoreOptions
  };
};
