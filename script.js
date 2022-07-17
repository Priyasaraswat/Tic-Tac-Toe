let origBoard;
const humanPlayer='X';
const aiPlayer='O';
const winningCombo=[
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,4,8],
  [0,3,6],
  [2,4,6],
  [1,4,7],
  [2,5,8]
];
const box=document.querySelectorAll(".box");
const msg=document.querySelector(".msg");
const pointhu=document.querySelector(".point-hu");
const pointai=document.querySelector(".point-ai");
const pointdr=document.querySelector(".point-dr");

let huCount=0;
let aiCount=0;
let drCount=0;
const miniMax=(newBoard,player)=>
{
  let availableSpots=emptySquares();
  if(checkWin(newBoard,humanPlayer))
  {
    return {score:-10};
  }
  else if(checkWin(newBoard,aiPlayer))
  {
    return {score:10};
  }
  else if(availableSpots.length===0)
  {
   return {score:0};
  }
  let moves=[];
  for(let i=0;i<availableSpots.length;i++)
  {
    var move={};
    move.index=newBoard[availableSpots[i]];
    newBoard[availableSpots[i]]=player;
    if(player==aiPlayer)
    {
      var result=miniMax(newBoard,humanPlayer);
      move.score=result.score;
    }
    else
    {
      var result=miniMax(newBoard,aiPlayer);
      move.score=result.score;
    }
    newBoard[availableSpots[i]]=move.index;
    moves.push(move);
  }
  let bestMove;
  if(player===aiPlayer)
  {
    let bestScore=-10000;
    for(let i=0;i<moves.length;i++)
    {
      if(moves[i].score>bestScore)
      {
        bestScore=moves[i].score;
        bestMove=i;
      }
    }
  }
  else
  {
    var bestScore=10000;
    for(let i=0;i<moves.length;i++)
    {
      if(moves[i].score<bestScore)
      {
        bestScore=moves[i].score;
        bestMove=i;
      }
    }
  }
  return moves[bestMove];
}
const bestSpot=()=>
{
  return miniMax(origBoard,aiPlayer).index;
}
const checkWin=(board,player)=>
{
    let plays=board.reduce((a,e,i)=>(e===player)?a.concat(i):a,[]);
   let gameWon=null;
   for(let[index,win]of winningCombo.entries())
   {
     if(win.every(elem=>plays.indexOf(elem) > -1))
     {
       gameWon={index:index,player:player};
       break;
     }
   }
   return gameWon;
}
const declareWinner=(who)=>
{

  console.log(who);
}
const emptySquares=()=>
{
  return origBoard.filter(s=> typeof s=="number");
}

const checkTie=()=>
{
  if(emptySquares().length==0)
  {
    for(let i=0;i<box.length;i++)
    {
      box[i].style.backgroundColor="#c51162";
    box[i].removeEventListener("click",turnClick,false)
    }
    msg.innerText="Draw !🙂";
    drCount++;
    pointdr.innerText=drCount;
    declareWinner("tie");
    return true;
  }
  return false;
}
const gameOver=(gameWon)=>
{
  for(let index of winningCombo[gameWon.index])
  {
    document.getElementById(index).style.backgroundColor=gameWon.player==humanPlayer?"#c51162":"#678";
  }
  for(let i=0;i<box.length;i++)
  {
    box[i].removeEventListener('click',turnClick,false);
  }
  //declareWinner(gameWon.player==humanPlayer?"You Won":"You Lost");
  if(gameWon.player==humanPlayer)
  {
    msg.innerText="You Won !👍";
    declareWinner("You Won");
    huCount++;
    pointhu.innerText=huCount;
  }
  else if(gameWon.player==aiPlayer)
  {
    msg.innerText="You Lost !👎";
    declareWinner("You Lost");
    aiCount++;
    pointai.innerText=aiCount;
  }
}
const turn=(squareId,player)=>
{
  origBoard[squareId]=player;
  document.getElementById(squareId).innerText=player;
  let gameWon= checkWin(origBoard,player);
  if(gameWon)
  {
    gameOver(gameWon);
  }
}
const turnClick=(e)=>
{
  if(typeof origBoard[e.target.id]=='number')
  {
    turn(e.target.id,humanPlayer);
  }
  if(!checkWin(origBoard,humanPlayer) && !checkTie())
  {
     turn(bestSpot(),aiPlayer);
  }
  
}
const startGame=()=>
{
   origBoard=Array.from(Array(9).keys());
  
  for(let i=0;i<box.length;i++)
  {
    box[i].innerText="";
    // box[i].style.removeProperty('background-color');
    box[i].style.backgroundColor="white";
    msg.innerText="Try It !💪";
    box[i].addEventListener("click",turnClick,false);
  }
}
startGame();