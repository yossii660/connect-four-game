import React, { useState, useEffect, useCallback } from 'react';
import SetupScreen from './components/SetupScreen';
import Board from './components/Board';
import StatusBar from './components/StatusBar';
import Confetti from './components/Confetti';
import './App.css';

const ConnectFourGame = () => {
    const [gameStarted, setGameStarted] = useState(false);
    const [cellSize, setCellSize] = useState(70);
    const [board, setBoard] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [winner, setWinner] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [undoTimeLeft, setUndoTimeLeft] = useState(0);
    const [lastMove, setLastMove] = useState(null);
    const [animatingCell, setAnimatingCell] = useState(null);
    const [hintMessage, setHintMessage] = useState('');
    const ROWS = 6;
    const COLS = 7;

    const initializeBoard = useCallback(() => {
        return Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
    }, []);

    const startGame = (size) => {
        setCellSize(size);
        setBoard(initializeBoard());
        setGameStarted(true);
        setCurrentPlayer(1);
        setWinner(null);
        setTimeLeft(10);
        setLastMove(null);
        setUndoTimeLeft(0);
        setHintMessage('');
    };

    const resetGame = () => {
        setBoard(initializeBoard());
        setCurrentPlayer(1);
        setWinner(null);
        setTimeLeft(10);
        setLastMove(null);
        setUndoTimeLeft(0);
        setHintMessage('');
    };

    const checkWinner = useCallback((board, row, col, player) => {
        const directions = [
            [0, 1],   // אופקי
            [1, 0],   // אנכי
            [1, 1],   // אלכסון ימין
            [1, -1]   // אלכסון שמאל
        ];

        for (const [dr, dc] of directions) {
            let count = 1;

            let r = row + dr;
            let c = col + dc;
            while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
                count++;
                r += dr;
                c += dc;
            }

            r = row - dr;
            c = col - dc;
            while (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === player) {
                count++;
                r -= dr;
                c -= dc;
            }

            if (count >= 4) return true;
        }

        return false;
    }, []);

    const canWinInNextMove = useCallback((board, player) => {
        for (let col = 0; col < board[0].length; col++) {
            let row = -1;
            for (let r = board.length - 1; r >= 0; r--) {
                if (board[r][col] === null) {
                    row = r;
                    break;
                }
            }

            if (row !== -1) {
                const testBoard = board.map(r => [...r]);
                testBoard[row][col] = player;
                if (checkWinner(testBoard, row, col, player)) {
                    return true;
                }
            }
        }
        return false;
    }, [checkWinner]);

    const handleColumnClick = (col) => {
        if (winner || undoTimeLeft > 0) return;

        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (board[r][col] === null) {
                row = r;
                break;
            }
        }

        if (row === -1) return;

        setAnimatingCell({ row, col, delay: 0 });
        setTimeout(() => setAnimatingCell(null), 600);

        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        if (checkWinner(newBoard, row, col, currentPlayer)) {
            setWinner(currentPlayer);
            setUndoTimeLeft(0);
            return;
        }
        setLastMove({ row, col, player: currentPlayer });
        setUndoTimeLeft(5);
        setHintMessage('');
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        setTimeLeft(10);
    };

    const handleUndo = () => {
        if (!lastMove || undoTimeLeft <= 0) return;

        const newBoard = board.map(r => [...r]);
        newBoard[lastMove.row][lastMove.col] = null;
        setBoard(newBoard);
        setCurrentPlayer(lastMove.player);
        setLastMove(null);
        setUndoTimeLeft(0);
        setTimeLeft(10);
    };

    const handleHint = () => {
        if (winner) return;

        const hasWinningMove = canWinInNextMove(board, currentPlayer);
        setHintMessage(
            hasWinningMove
                ? '💡 יש לך מהלך מנצח! חפש היטב...'
                : '💭 אין מהלך מנצח במהלך הבא'
        );
        setTimeout(() => setHintMessage(''), 3000);
    };

    const backToHome = () => {
        setGameStarted(false);
        setBoard([]);
        setCurrentPlayer(1);
        setWinner(null);
        setTimeLeft(10);
        setLastMove(null);
        setUndoTimeLeft(0);
        setHintMessage('');
    };

    useEffect(() => {
        if (winner || !gameStarted || board.length === 0 || undoTimeLeft > 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setCurrentPlayer(p => (p === 1 ? 2 : 1));
                    setLastMove(null);
                    return 10;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [winner, gameStarted, board.length, undoTimeLeft]);

    useEffect(() => {
        if (undoTimeLeft <= 0) return;

        const timer = setInterval(() => {
            setUndoTimeLeft(prev => {
                if (prev <= 1) {
                    setLastMove(null);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [undoTimeLeft]);

    if (!gameStarted) {
        return <SetupScreen onStartGame={startGame} />;
    }

    if (board.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            {winner && <Confetti />}
            
            <div className="app-wrapper">
                <h1 className="app-title">4 בשורה</h1>

                {hintMessage && (
                    <div className="hint-message">{hintMessage}</div>
                )}

                <div className="game-layout">
                    <Board
                        board={board}
                        onColumnClick={handleColumnClick}
                        animatingCell={animatingCell}
                        winner={winner}
                        cellSize={cellSize}
                    />

                    <StatusBar
                        currentPlayer={currentPlayer}
                        timeLeft={timeLeft}
                        undoTimeLeft={undoTimeLeft}
                        canUndo={lastMove !== null && undoTimeLeft > 0}
                        onUndo={handleUndo}
                        onReset={resetGame}
                        onHint={handleHint}
                        onBackToHome={backToHome}
                        winner={winner}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConnectFourGame;