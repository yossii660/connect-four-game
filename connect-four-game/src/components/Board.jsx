import React from 'react';
import '../App.css';

const Board = ({ board, onColumnClick, animatingCell, winner, cellSize }) => {
    const rows = board.length;
    const cols = board[0].length;

    return (
        <div className="board-container">
            <div
                className="board-grid"
                style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
            >
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const isAnimating = animatingCell?.row === rowIndex && animatingCell?.col === colIndex;

                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => !winner && onColumnClick(colIndex)}
                                className={`cell ${winner ? 'disabled' : ''}`}
                                style={{
                                    width: cellSize,
                                    height: cellSize,
                                }}
                            >
                                {cell !== null && (
                                    <div
                                        className={`piece ${cell === 1 ? 'red' : 'yellow'} ${isAnimating ? 'animating' : ''}`}
                                        style={{
                                            width: cellSize * 0.85,
                                            height: cellSize * 0.85,
                                            '--drop-start': `-${(rowIndex + 1) * cellSize}px`
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Board;