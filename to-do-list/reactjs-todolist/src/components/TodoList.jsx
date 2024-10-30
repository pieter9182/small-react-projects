import React from 'react'
import TodoCard from './TodoCard'

export default function TodoList(props) {
  const { todos } = props;

  return (
    <ul className='main'>
      {todos.map((todo, TodoIndex) => {
        return (
          <TodoCard {...props} key={TodoIndex} index={TodoIndex}>
            <p>{todo}</p>
          </TodoCard>
        )
      })}
    </ul>
  )
}