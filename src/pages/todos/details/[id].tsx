import { Button, Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/router";
import { TodoApiClient } from "src/client/api/todos.client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ITodo } from "@shared/models/todo.model";
import { TodoView } from "src/components/TodoView";

const todoClient = new TodoApiClient();

type Data = {
  todo: ITodo;
};

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const todoId = context.params?.id;
  const todo = await todoClient.getById(String(todoId));
  return {
    props: {
      todo,
    },
  };
};

export default function ViewTodoDetails({
  todo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Container className="pt-4">
      <div className="sm:px-40 px-0 ">
        <Link href="/" passHref>
          <Button
            variant="contained"
            className="bg-black hover:bg-gray-800 translate-x-[-100%] animate-slide-left"
          >
            <ArrowBackIcon />
            Back
          </Button>
        </Link>
      </div>

      <PageTitle
        title="Todo Details"
        center
        className="translate-x-[-140%] animate-slide-left"
      />
      <TodoView todo={todo} />
    </Container>
  );
}
