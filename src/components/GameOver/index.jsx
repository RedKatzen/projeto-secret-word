import './index.css';

const GameOver = ({ retry }) => {
  return (
    <div>
      <h1>Game Over</h1>
      <button onClick={retry}>Tentar novamente</button>
    </div>
  )
}

export default GameOver