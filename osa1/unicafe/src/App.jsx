import { useState } from 'react'

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const StatisticsLine = ({text, value}) => {
  return(
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  let avg = 0
  let positive = 0

  if (all > 0) {
    avg = (good - bad) / all
    if (good > 0)
      positive = good / all * 100
  }
  else {
    return(
      <p>no feedback given</p>
    )
  }

  return(
    <table>
      <tbody>
        <StatisticsLine text='good:' value={good} />
        <StatisticsLine text='neutral:' value={neutral} />
        <StatisticsLine text='bad:' value={bad} />
        <StatisticsLine text='all:' value={all} />
        <StatisticsLine text='avg:' value={avg} />
        <StatisticsLine text='positive:' value={positive + '%'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleFeedbackClick = (feedbackType) => {
    switch(feedbackType) {
      case 'good':
        setGood(good + 1)
        break
      case 'neutral':
        setNeutral(neutral + 1)
        break
      case 'bad':
        setBad(bad + 1)
        break
      default:
        break
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={() => handleFeedbackClick('good')} text='good' />
      <Button onClick={() => handleFeedbackClick('neutral')} text='neutral' />
      <Button onClick={() => handleFeedbackClick('bad')} text='bad' />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
