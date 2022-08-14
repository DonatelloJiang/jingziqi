import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }
    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}

class LightSquare extends Square {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <button
                className="light-square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i, key, winnerArray) {
        if (i === this.props.position || (winnerArray != null && winnerArray.includes(i))) {
            return <LightSquare
                key={key}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />;
        } else {
            return <Square
                key={key}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />;
        }
    }

    render() {
        let rowLength = this.props.squares.length / this.props.cols;
        console.log("长度：" + this.props.squares.length)
        console.log("宽度：" + this.props.cols)
        let boardRows = Array(rowLength).fill(null);
        for (let index = 0; index < this.props.squares.length;) {
            let rowIndex = Math.floor(index / this.props.cols);
            let rows = Array(this.props.cols).fill(null);
            for (let i = 0; i < this.props.cols; i++) {
                rows[i] = index;
                index++;
            }
            boardRows[rowIndex] = rows.map((r, i) => {
                return (
                    this.renderSquare(r, i, this.props.winner)
                )
            })
        }
        return (
            <div>
                {
                    boardRows.map((row, index) => {
                        console.log("第" + index + "行:" + row);
                        return (
                            <div key={index} className="board-row">
                                {row}
                            </div>
                        )
                    })
                }
            </div>
        )

        // return (
        //     <div>
        //         <div className="board-row">
        //             {this.renderSquare(0)}
        //             {this.renderSquare(1)}
        //             {this.renderSquare(2)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(3)}
        //             {this.renderSquare(4)}
        //             {this.renderSquare(5)}
        //         </div>
        //         <div className="board-row">
        //             {this.renderSquare(6)}
        //             {this.renderSquare(7)}
        //             {this.renderSquare(8)}
        //         </div>
        //     </div>
        // );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: null,
                cols: 3
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    handlerClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                position: i,
                cols: 3
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let col = step.position % 3 + 1;
            let row = Math.ceil(step.position / 3) + 1;
            const desc = move ?
                "Go to move #" + move + ":第" + row + "行,第" + col + "列" :
                "Go to game start";

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })


        let status;
        if (winner) {
            status = 'Winner: ' + winner[0];
        } else if (calculateEnding(current.squares)) {
            status = '平局'
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handlerClick(i)}
                        position={current.position}
                        cols={current.cols}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <ol>{status}</ol>
                    <ol>{/* TODO */}</ol>
                    <ol>{moves}</ol>
                </div>
                <div>
                    <ShoppingList name="hello world" />
                </div>
            </div>
        );
    }
}

class ShoppingList extends React.Component {
    render() {
        return (
            React.createElement("div", { className: "shopping-list" },
                React.createElement("h1", null, "Shoping list for ", this.props.name),
                React.createElement("ul", null,
                    React.createElement("li", null, "Instagram"),
                    React.createElement("li", null, "WhatsApp"),
                    React.createElement("li", null, "Oculus")
                )
            )
        );
    }
}

function calculateEnding(squares) {
    if (squares) {
        for (let index = 0; index < squares.length; index++) {
            if (!squares[index]) {
                return false;
            }
        }
        return true;
    }
    return false;
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
