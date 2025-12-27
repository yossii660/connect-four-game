import React, { useState } from 'react';
import '../App.css';

const SetupScreen = ({ onStartGame }) => {
    const [boardSize, setBoardSize] = useState('medium');

    const sizeOptions = {
        small: { label: 'קטן', cellSize: 50 },
        medium: { label: 'בינוני', cellSize: 70 },
        large: { label: 'גדול', cellSize: 90 }
    };

    return (
        <div className="setup-container">
            <div className="setup-box">
                <h1 className="setup-title">4 בשורה</h1>

                <div className="features-box">
                    <h2 className="features-title">תכונות המשחק:</h2>
                    <ul className="features-list">
                        <li>
                            <span className="feature-icon">🎮</span>
                            <span>לחצו על עמודה כדי להניח אסימון</span>
                        </li>
                        <li>
                            <span className="feature-icon">⏱️</span>
                            <span>כל שחקן מקבל 10 שניות לביצוע מהלך</span>
                        </li>
                        <li>
                            <span className="feature-icon">↩️</span>
                            <span>אפשרות UNDO תוך 5 שניות מהמהלך</span>
                        </li>
                        <li>
                            <span className="feature-icon">💡</span>
                            <span>כפתור רמז - בודק אם יש ניצחון במהלך הבא</span>
                        </li>
                        <li>
                            <span className="feature-icon">🔄</span>
                            <span>כפתור Reset להתחלת משחק חדש</span>
                        </li>
                        <li>
                            <span className="feature-icon">🎨</span>
                            <span>אנימציית נפילה לאסימונים</span>
                        </li>
                        <li>
                            <span className="feature-icon">📏</span>
                            <span>בחירת גודל תצוגה - קטן/בינוני/גדול</span>
                        </li>
                    </ul>
                </div>

                <div className="size-selector">
                    <label className="size-label">בחר גודל תצוגה:</label>
                    <div className="size-buttons">
                        {Object.entries(sizeOptions).map(([key, { label }]) => (
                            <button
                                key={key}
                                onClick={() => setBoardSize(key)}
                                className={`size-button ${boardSize === key ? 'active' : ''}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => onStartGame(sizeOptions[boardSize].cellSize)}
                    className="start-button"
                >
                    התחל משחק!
                </button>
            </div>
        </div>
    );
};

export default SetupScreen;