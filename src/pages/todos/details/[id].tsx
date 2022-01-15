import { Button, Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { InferGetServerSidePropsType } from "next";
import { ITodo } from "@shared/models/todo.model";
import { TodoView } from "src/components/TodoView";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { TodoApiService } from "src/client/services/todos.service";

const todoClient = new TodoApiService();

type Data = {
  todo: ITodo;
};

export const getServerSideProps = withPageAuthRequired<Data>({
  getServerSideProps: async (context) => {
    const todoId = context.params?.id;
    const todo = await todoClient.getById(String(todoId));
    return {
      props: {
        todo,
      },
    };
  },
});

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
