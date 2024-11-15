// Acá solo van a ir las funciones que se usen en más de un componente

import React, { createContext } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <TaskContext.Provider value={{capitalizeFirstLetter}}>
            {children}
        </TaskContext.Provider>
    )
}
