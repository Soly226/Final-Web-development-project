import { useState } from 'react';
import { logsData } from '../../../data/pages/admin/SystemLogsPage.data';

export const useSystemLogs = () => {
    const [search, setSearch] = useState('');
    const [filterLevel, setFilterLevel] = useState('All Levels');
    const [filterCategory, setFilterCategory] = useState('All Categories');

    const handleExport = (count) => {
        alert(`Exporting ${count} logs to CSV...`);
    };

    const handleNextPage = () => {
        alert("No more pages available.");
    };

    const filteredLogs = logsData.filter(log => {
        const matchesSearch = search === '' || 
            log.message.toLowerCase().includes(search.toLowerCase()) || 
            log.user.toLowerCase().includes(search.toLowerCase());
        
        const matchesLevel = filterLevel === 'All Levels' || log.level === filterLevel;
        const matchesCategory = filterCategory === 'All Categories' || log.category === filterCategory;

        return matchesSearch && matchesLevel && matchesCategory;
    });

    return {
        search,
        setSearch,
        filterLevel,
        setFilterLevel,
        filterCategory,
        setFilterCategory,
        filteredLogs,
        handleExport,
        handleNextPage
    };
};
