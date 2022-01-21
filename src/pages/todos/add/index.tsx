import { useRouter } from "next/router";
import { PromiseUtils } from "@shared/utils/PromiseUtilts";
import React from "react";
import { CreateOrEditTodoPage } from "src/components/CreateOrEditTodoPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { TodoApiService } from "src/client/services/todos.service";

const todoClient = new TodoApiService();

function CreateTodo() {
  const router = useRouter();

  return (
    <CreateOrEditTodoPage
      title={"Create Todo"}
      submitText="Create"
      onSubmit={async (data) => {
        await PromiseUtils.delay(1000);
        await todoClient.create(data);
        router.push("/");
      }}
    />
  );
}

export default withPageAuthRequired(CreateTodo);
