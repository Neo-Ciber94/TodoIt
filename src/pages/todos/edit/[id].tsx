import { useRouter } from "next/router";
import { InferGetServerSidePropsType } from "next";
import { ITodo } from "@shared/models/todo.model";
import { PromiseUtils } from "@shared/utils/PromiseUtilts";
import { CreateOrEditTodoPage } from "src/components/CreateOrEditTodoPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { services } from "src/client/services";

type Data = {
  todo: ITodo;
};

export const getServerSideProps = withPageAuthRequired<Data>({
  getServerSideProps: async ({ req, ...context }) => {
    const todoId = context.params?.id;
    const todo = await services.todos.getById(String(todoId), {
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
      submitText={"Save"}
      onSubmit={async (data) => {
        const { id } = router.query;
        await PromiseUtils.delay(1000);
        await services.todos.update(String(id), data);
        router.push("/");
      }}
    />
  );
}
