let canvas,
    canvasContext,
    ballHorizon = 50,
    speedBallHorizon = 10,
    ballVertical = 50,
    speedBallVertical = 4,
    paddlePlayerOne = 250,
    paddleComputer = 250,
    playerOneScore = 0,
    computerScore = 0,
    winScreen = false;

const PADDLE_THICK = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 5;

function mousePosition(position) {
    //FIND A RELATIVE MOUSE POSITION
    let rect = canvas.getBoundingClientRect(),
        root = document.documentElement,
        mouseHorizon = position.clientX - rect.left - root.scrollLeft,
        mouseVertical = position.clientY - rect.top - root.scrollTop;
    return {
        x: mouseHorizon,
        y: mouseVertical
    };
}

function mouseClick() {
    //CLICK TO START A GAME  AND RESET ON WIN OR LOSE SCREEN
    if (winScreen) {
        playerOneScore = 0;
        computerScore = 0;
        winScreen = false;
    }
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    //Create motions ball movement on the canvas per sec.
    let fps = 30;
    setInterval(function () {
        ballMovement();
        object();
    }, 1000 / fps);
    
    //Click to reset a game
    canvas.addEventListener('mousedown', mouseClick)

    canvas.addEventListener('mousemove', function (position) {
        //Create a function to moving the mouse
        let mousePos = mousePosition(position);
        paddlePlayerOne = mousePos.y - (PADDLE_HEIGHT / 2);
    });
}

function resetBall() {
    //reset in the middle of canvas if each one hit a point
    if (computerScore >= WINNING_SCORE || playerOneScore >= WINNING_SCORE) {
        winScreen = true;
    }
    speedBallHorizon = -speedBallHorizon;
    ballHorizon = canvas.width / 2;
    ballVertical = canvas.height / 2;
}

function AImovement() {
    //Control AImovement
    let paddleComputerCenter = paddleComputer + (PADDLE_HEIGHT / 2);
    if (paddleComputerCenter < ballVertical - 35) {
        paddleComputer += 8;
    } else if (paddleComputerCenter > ballVertical + 35) {
        paddleComputer -= 8;
    }
}

function ballMovement() {
    //return the winScreen if reach WINNING_SCORE
    if (winScreen) {
        return;
    }
    //Call the AImovement function
    AImovement();
    //SET ball movement
    ballHorizon += speedBallHorizon;
    ballVertical += speedBallVertical;
    //SET a force ball bounces into the paddle computer
    if (ballHorizon > canvas.width) {
        if (ballVertical > paddleComputer && ballVertical < paddleComputer + PADDLE_HEIGHT) {
            speedBallHorizon = -speedBallHorizon;

            let hitHorizon = ballVertical - (paddleComputer + PADDLE_HEIGHT / 2);
            speedBallVertical = hitHorizon * 0.35;
          //IF miss set playerscore and call resetBall function.
        } else {
            playerOneScore++;
            resetBall();
        }
    }
    //SET a force ball bounces into the paddle player
    if (ballHorizon < 0) {
        if (ballVertical > paddlePlayerOne && ballVertical < paddlePlayerOne + PADDLE_HEIGHT) {
            speedBallHorizon = -speedBallHorizon;

            let hitHorizon = ballVertical - (paddlePlayerOne + PADDLE_HEIGHT / 2);
            speedBallVertical = hitHorizon * 0.35;
         //IF miss set computerScore and call resetBall function.
        } else {
            computerScore++;
            resetBall();
        }
        //SET speedball when hit paddle 
    }
    if (ballVertical > canvas.height) {
        speedBallVertical = -speedBallVertical;
    }
    if (ballVertical < 0) {
        speedBallVertical = -speedBallVertical;
    }
}

function object() {
    //Background screen
    colorObject(0, 0, canvas.width, canvas.height, 'grey');

    //SHOWING WIN OR LOSE SCREEN
    if (winScreen) {
        canvasContext.fillStyle = 'black';
        if (computerScore >= WINNING_SCORE) {
            canvasContext.fillText('YOU LOSE!', canvas.width / 2 - 1, 200);
        } else if (playerOneScore >= WINNING_SCORE) {
            canvasContext.fillText('YOU WON!', canvas.width / 2 - 1, 200);
        }
        canvasContext.fillText('CLICK TO START A NEW GAME', canvas.width / 2 - 50, 500, 400);
        return;
    }

    //NET DRAW
    netDrawer();

    canvasContext.fillStyle = 'black';
    canvasContext.fillText('HIT 5 POINTS TO WIN A GAME!', canvas.width / 2 - 200, 100);

    //left player paddle
    colorObject(0, paddlePlayerOne, PADDLE_THICK, PADDLE_HEIGHT, 'black');

    //computer paddle
    colorObject(canvas.width - PADDLE_THICK, paddleComputer, PADDLE_THICK, PADDLE_HEIGHT, 'black');

    //Ball drawer
    colorBall(ballHorizon, ballVertical, 10, 'black');

    //Score display
    canvasContext.fillText(playerOneScore, 100, 100);
    canvasContext.fillText(computerScore, canvas.width - 100, 100);

}

function netDrawer() {
    //NET DRAWER
    for (let i = 0; i < canvas.height; i += 40) {
        colorObject((canvas.width / 2) - 1, i, 2, 20, 'black');
    }
}

function colorBall(centerX, centerY, radius, drawColor) {
    //SHAPE AND COLOR BALL
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorObject(leftX, topY, width, height, drawColor) {
    //BACKGROUND
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}
