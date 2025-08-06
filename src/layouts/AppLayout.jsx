import React from 'react'

const AppLayout = ({ children }) => {
    return (
        <div className="min-vh-100 bg-game-gradient text-white w-100 py-3">
            {/* Top Logos Row */}
            <div className="d-flex align-items-center justify-content-between" style={{ height: '60px' }}>
                {/* Spacer (left side) */}
                <div style={{ width: '40px' }}></div>

                {/* Center Logo */}
                <div className="d-flex justify-content-center flex-grow-1">
                    <img
                        src="/images/pro-courts.png"
                        alt="Pro Courts"
                        style={{ height: '150px', objectFit: 'contain' }}
                    />
                </div>

                {/* Right Logo */}
                <div className="me-2">
                    <img
                        src="/images/sports-sync.png"
                        alt="Sports Sync"
                        style={{ height: '50px', objectFit: 'contain' }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div>
                {children}
            </div>

            {/* Bottom Branding */}
            <div className="text-center mt-5">
                <span className="me-2">Scoreboard powered by</span>
                <img
                    src="/images/gts-01.png"
                    alt="Game Tech"
                    style={{ height: '150px', objectFit: 'contain', verticalAlign: 'middle' }}
                />
            </div>
        </div>
    )
}

export default AppLayout
