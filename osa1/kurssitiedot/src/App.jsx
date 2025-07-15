const Header = (props) => {
  return (
    <h1>
      {props.course}
    </h1>
  )
}

const Part = (props) => {
  return (
    <p>
      {props.course} {props.exercises}
    </p>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part course={props.parts[0].name} exercises={props.parts[0].exercises} />
      <Part course={props.parts[1].name} exercises={props.parts[1].exercises} />
      <Part course={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  )
}

const Total = (props) => {
  let exerciseCount = 0;
  for (let i = 0; i < props.parts.length; i++) {
    exerciseCount += props.parts[i].exercises;
  }
  
  return (
    <p>
      Number of exercises: {exerciseCount}
    </p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} /> 
      <Content parts={course.parts} />
      <Total parts={course.parts} />   
    </div>
  )
}

export default App