// Acá solo van a ir las funciones que se usen en más de un componente

import React, { createContext } from 'react';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {

    return (
        <TaskContext.Provider value={{}}>
            {children}
        </TaskContext.Provider>
    )
}
