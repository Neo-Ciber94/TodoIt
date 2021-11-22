import { PageResult } from "@lib/repositories/base/repository";
import { InferGetServerSidePropsType } from "next";
import { ITodo } from "src/shared/todo.model";
import Masonry from "@mui/lab/Masonry";
import TodoNote from "src/components/TodoNote";
import { Container } from "@mui/material";
import React from "react";

const API_URL = "http://localhost:3000/api/todos";

export const getServerSideProps = async () => {
  const res = await fetch(API_URL);
  const json = await res.json();
  const data = json as PageResult<ITodo>;
  return { props: { data } };
};

const HEIGHTS = [200, 250, 280, 230, 300, 270, 300];

function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [todos, setTodos] = React.useState(data.data);

  return (
    <Container sx={{ padding: 5 }}>
      <Masonry columns={[1, 2, 3, 4]} spacing={1}>
        {(todos || []).map((todo, index) => (
          <TodoNote
            key={todo._id}
            todo={todo}
            height={HEIGHTS[index % todos.length]}
            onComplete={(item) => {
              item.completed = !item.completed;

              fetch(`${API_URL}/${item._id}`, {
                method: "PUT",
                body: JSON.stringify(item)
              }).then(async res => {
                const index = todos.findIndex(t => t._id === item._id);
                const newTodos = [...todos];
                newTodos[index] = await res.json();
                setTodos(newTodos);
              })
            }}
          />
        ))}
      </Masonry>
    </Container>
  );
}

const RNG = xmur3("123");
function randomHeight(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/*
XOR Shift Random Number Generator
https://en.wikipedia.org/wiki/Xorshift
 */
function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0, len = str.length; i < len; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

export default Page;
