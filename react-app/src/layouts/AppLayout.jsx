import React from 'react';

const AppLayout = ({ children }) => {
    return (
        <div className="min-vh-100 bg-game-gradient text-white w-100 py-5">
            {/* Top Logos Row */}
            <div
                className="d-flex align-items-center justify-content-between px-2"
                style={{ height: 'clamp(50px, 8vh, 120px)' }}
            >
                {/* Spacer (left side) */}
                <div style={{ width: 'clamp(20px, 4vw, 60px)' }}></div>

                {/* Center Logo */}
                <div className="d-flex justify-content-center flex-grow-1">
                    <img
                        src="/images/pro-courts.png"
                        alt="Pro Courts"
                        style={{
                            height: 'clamp(40px, 8vh, 120px)',
                            maxWidth: '50%',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {/* Right Logo */}
                <div className="me-2">
                    <img
                        src="/images/sports-sync.png"
                        alt="Sports Sync"
                        style={{
                            height: 'clamp(25px, 6vh, 90px)',
                            maxWidth: '70%',
                            objectFit: 'contain',
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="mt-5">{children}</div>

            {/* Bottom Branding */}
            <div className="text-center mt-5">
                <span className="me-2">Scoreboard powered by</span>
                <img
                    src="/images/gts-01.png"
                    alt="Game Tech"
                    style={{
                        height: 'clamp(40px, 8vh, 120px)',
                        maxWidth: '25%',
                        objectFit: 'contain',
                        verticalAlign: 'middle',
                    }}
                />
            </div>
        </div>
    );
};

export default AppLayout;
