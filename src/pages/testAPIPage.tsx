/*
import { useState, useEffect } from "react";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


const client = generateClient<Schema>();

const TodoList: React.FC = () => {

  const [todos, setTodos] = useState<Schema["Test"]["type"][]>([]);

  const [name, setName] = useState<string>("");
  const [otherName, setOtherName] = useState<string>("");

  const fetchTodos = async () => {
    try {
    const { data: items, errors } = await client.models.Test.list();
    console.log("Gathered Tests: ", items, errors);
    setTodos(items);
    } catch (err) {
        console.error("Error while fetching tests: ", err)
    }
  }; 

  useEffect(() => {
    fetchTodos(); 
  }, []);

  useEffect(() => {
    console.log(`Name: ${name}, Other Name: ${otherName}`)
  }, [name, otherName]);

  const createTodo = async () => {
    try {
    console.log("called")
    const newTodo = await client.models.Test.create({
      name: name,
      otherName: otherName
    });
    console.log("New Tests Created: ", newTodo);
    console.log("called 2")


    setName("");
    setOtherName("");
    fetchTodos();
    } catch (err) {
        console.error("Error while creating: ", err);
        console.error("Read me: ", name, otherName);
    }
  }

  return (
    <div>
      <ul>
        {todos.map(( { id, name, otherName } ) => (
          <li key={id}>{name} {otherName}</li>
        ))}
      </ul>

    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    <input type="text" value={otherName} onChange={(e) => setOtherName(e.target.value)} />

      <button onClick={createTodo}>Add new Test</button>

    </div>
  );
}


export default TodoList
*/