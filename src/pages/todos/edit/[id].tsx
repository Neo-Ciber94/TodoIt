import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next";
import { ITodo } from "@shared/models/todo.model";
import { PromiseUtils } from "@shared/utils/PromiseUtilts";
import { CreateOrEditTodoPage } from "src/components/CreateOrEditTodoPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { TodoApiService } from "src/client/services/todos.service";

const todoClient = new TodoApiService();

type Data = {
  todo: ITodo;
};

export const getServerSideProps = withPageAuthRequired<Data>({
  getServerSideProps: async ({ req, ...context }) => {
    const todoId = context.params?.id;
    const todo = await todoClient.getById(String(todoId), {
      headers: { cookie: req.headers.cookie || "" },
    });
    return {
      props: {
        todo,
      },
    };
  },
});

export default function EditTodo({
  todo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  return (
    <CreateOrEditTodoPage
      todo={todo}
      title={"Edit Todo"}
      submitText={"Edit Todo"}
      onSubmit={async (data) => {
        try {
          const { id } = router.query;
          await todoClient.update(String(id), data);
          await PromiseUtils.delay(1000);
          router.push("/");
        } catch (e) {
          // TODO: Shows the error to the user
          console.error(e);
        }
      }}
    />
  );
}
