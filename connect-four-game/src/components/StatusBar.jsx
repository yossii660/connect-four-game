import React from 'react';
import { RotateCcw, Lightbulb, Undo, Home } from 'lucide-react';
import '../App.css';

const StatusBar = ({
                       currentPlayer,
                       timeLeft,
                       undoTimeLeft,
                       canUndo,
                       onUndo,
                       onReset,
                       onHint,
                       onBackToHome,
                       winner
                   }) => {
    return (
        <div className="status-container">
            {!winner && (
                <div className="status-box">
                    <div className="current-player">
                        <div className="player-label">
                            תור שחקן {currentPlayer === 1 ? '1' : '2'}
                        </div>
                        <div className={`player-indicator ${currentPlayer === 1 ? 'red' : 'yellow'}`} />
                    </div>

                    <div className="timer-section">
                        <div className="timer-label">זמן נותר למהלך</div>
                        <div className={`timer-value ${timeLeft <= 3 ? 'warning' : ''}`}>
                            {timeLeft}s
                        </div>
                    </div>

                    {canUndo && (
                        <div className="undo-box">
                            <div className="undo-timer">
                                <div className="undo-timer-label">זמן לביטול המהלך</div>
                                <div className="undo-timer-value">{undoTimeLeft}s</div>
                            </div>
                            <button onClick={onUndo} className="undo-button">
                                <Undo size={20} />
                                ביטול מהלך אחרון
                            </button>
                        </div>
                    )}
                </div>
            )}

            {winner && (
                <div className="winner-box">
                    <div className="winner-content">
                        <div className="winner-text">
                             שחקן {winner} ניצח! 🎉
                        </div>
                        <div className={`winner-indicator ${winner === 1 ? 'red' : 'yellow'}`} />
                    </div>
                </div>
            )}

            <div className="controls">
                <button
                    onClick={onHint}
                    disabled={winner !== null}
                    className="control-button hint"
                >
                    <Lightbulb size={20} />
                    רמז
                </button>

                <button onClick={onReset} className="control-button reset">
                    <RotateCcw size={20} />
                    משחק חדש
                </button>
            </div>

            <button onClick={onBackToHome} className="home-button">
                <Home size={20} />
                חזרה למסך הבית
            </button>
        </div>
    );
};

export default StatusBar;