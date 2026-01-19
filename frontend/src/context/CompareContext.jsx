import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const useCompare = () => useContext(CompareContext);

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('compareList') || '[]');
        setCompareList(saved);
    }, []);

    const addToCompare = (property) => {
        if (compareList.find(p => p.id === property.id)) {
            toast.error('Property already in compare list');
            return;
        }
        if (compareList.length >= 3) {
            toast.error('You can compare max 3 properties');
            return;
        }
        const newList = [...compareList, property];
        setCompareList(newList);
        localStorage.setItem('compareList', JSON.stringify(newList));
        toast.success('Added to comparison');
    };

    const removeFromCompare = (id) => {
        const newList = compareList.filter(p => p.id !== id);
        setCompareList(newList);
        localStorage.setItem('compareList', JSON.stringify(newList));
    };

    const clearCompare = () => {
        setCompareList([]);
        localStorage.removeItem('compareList');
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare }}>
            {children}
        </CompareContext.Provider>
    );
};
