const Header = ({courseName}) => {
  return (
    <h2>
      {courseName}
    </h2>
  )
}

const Part = ({courseName, exercises}) => {
  return (
    <p>
      {courseName} {exercises}
    </p>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      {parts.map(part => <Part key={part.id} courseName={part.name} exercises={part.exercises} />)}
      <Total parts={parts} />
    </div>
  )
}

const Total = ({parts}) => {
  const exerciseCount = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <b>total of {exerciseCount} exercises</b>
  )
}

const Course = ({course}) => {
  return (
    <>
      <Header courseName={course.name} /> 
      <Content parts={course.parts} />     
    </>
  )
}

export default Course