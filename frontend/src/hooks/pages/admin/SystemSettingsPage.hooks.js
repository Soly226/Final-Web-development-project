import React from 'react';

export const useSystemSettings = () => {
  const logoInputRef = React.useRef(null);

  const handleSave = () => {
    alert("Configuration changes saved successfully!");
  };

  const handleReplaceAsset = () => {
    logoInputRef.current?.click();
  };

  return {
    logoInputRef,
    handleSave,
    handleReplaceAsset
  };
};
