const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }

  const normalStyle = {
    color: 'green',
    borderColor: 'green',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '20px',
    background: 'lightGrey'
  }
  const errorStyle = {
    color: 'red',
    borderColor: 'red',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
    fontSize: '20px',
    background: 'lightGrey'
  }
  let style = isError ? errorStyle : normalStyle

  return (
    <div style={style}>
      <p data-testid='notificationText'>{message}</p>
    </div>
  )
}

export default Notification