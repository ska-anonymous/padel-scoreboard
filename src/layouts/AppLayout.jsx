import React from 'react'

const AppLayout = ({ children }) => {
    return (
        <div className="container-fluid bg-dark text-white min-vh-100 d-flex flex-column p-0">
            {children}
        </div>
    )
}

export default AppLayout
