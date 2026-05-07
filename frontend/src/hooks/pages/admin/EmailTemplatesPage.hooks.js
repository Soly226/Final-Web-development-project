import { useState } from 'react';
import { INITIAL_TEMPLATES } from '../../../data/pages/admin/EmailTemplatesPage.data';

export const useEmailTemplates = () => {
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
    const [activeId, setActiveId] = useState('enrollment');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentTemplate = templates[activeId];

    const handleUpdate = (field, value) => {
        setTemplates(prev => ({
            ...prev,
            [activeId]: {
                ...prev[activeId],
                [field]: value
            }
        }));
    };

    const handleInsertPlaceholder = (tag) => {
        handleUpdate('body', currentTemplate.body + ' ' + tag);
        alert(`Inserted ${tag} at the end of the template.`);
    };

    const handleAddTemplate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newName = formData.get('template_name');
        const newId = newName.toLowerCase().replace(/\s+/g, '_');

        if (templates[newId]) {
            alert("A template with this name already exists.");
            return;
        }

        setTemplates(prev => ({
            ...prev,
            [newId]: {
                name: newName,
                subject: `New Subject for ${newName}`,
                body: `Hi {{student_name}},\n\nWelcome to ${newName}!\n\nBest regards,\nThe Team`
            }
        }));
        setActiveId(newId);
        setIsModalOpen(false);
    };

    const handleCommit = (name) => {
        alert(`Successfully committed changes for template: ${name}`);
    };

    const handleSendTest = () => {
        alert('Test email sent to your admin email address.');
    };

    return {
        templates,
        activeId,
        setActiveId,
        isModalOpen,
        setIsModalOpen,
        currentTemplate,
        handleUpdate,
        handleInsertPlaceholder,
        handleAddTemplate,
        handleCommit,
        handleSendTest
    };
};
