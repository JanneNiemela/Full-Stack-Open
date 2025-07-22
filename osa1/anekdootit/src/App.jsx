import { useState } from 'react'

const Button = ({handleClick, name}) => {
  return (
    <button onClick={handleClick}>{name}</button>
  )
}

const RandomAnecdoteDisplay = ({selected, anecdotes, votes}) => {
  return (
    <>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>  
    </>
  )
}

const MostVotesAnecdoteDisplay = ({anecdotes, votes}) => {
  let maxVotes = Math.max(...votes)
  return (
    <>
      <h1>Anecdote with the most votes</h1>
      <p>{maxVotes > 0 ? anecdotes[votes.indexOf(maxVotes)] : 'no votes yet...'}</p> 
      <p>{maxVotes > 0 ? 'has ' + maxVotes + ' votes' : ''}</p>
    </>
  )
}

const App = () => {

  const getRandomIndex = (max) => Math.floor(Math.random() * max)

  const handleRndBtnClick = () => {
    setSelected(getRandomIndex(anecdotes.length))
  }

  const handleVoteClick = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)
  }

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(getRandomIndex(anecdotes.length - 1))
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  return (
    <div>
      <RandomAnecdoteDisplay selected={selected} anecdotes={anecdotes} votes={votes} />
      <Button handleClick={handleRndBtnClick} name='next anecdote'/>
      <Button handleClick={handleVoteClick} name='vote'/>
      <MostVotesAnecdoteDisplay anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App