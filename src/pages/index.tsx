import { TodoDocument } from "@lib/models/todo.types";
import { PageResult } from "@lib/repositories/base/repository";
import type { InferGetServerSidePropsType } from "next";

const API_URL = "http://localhost:3000/api/todos";

export const getServerSideProps = async () => {
  const res = await fetch(API_URL);
  const json = await res.json();
  const todos = json as PageResult<TodoDocument>;
  return { props: { todos } };
};

function Page({
  todos,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const result = todos.data;

  return (
    <div>

    </div>
  );
}

export default Page;
