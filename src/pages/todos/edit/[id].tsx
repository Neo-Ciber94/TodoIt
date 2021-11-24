import { TodoForm } from "src/components/TodoForm";
import { Button, Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/router";
import { TodoApiClient } from "src/client/api/todos.client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ITodo } from "@shared/models/todo.model";

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

export default function EditTodo({
  todo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { id } = router.query;

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
        title="Edit Todo"
        center
        className="translate-x-[-140%] animate-slide-left"
      />
      <TodoForm
        initialValue={todo}
        buttonText="Edit Todo"
        onSubmit={async (data) => {
          try {
            const result = await todoClient.update(String(id), {
              ...todo,
              ...data,
            });
            console.log("EDITED: ", result);
            router.push("/");
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </Container>
  );
}
