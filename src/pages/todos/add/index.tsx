import { TodoApiClient } from "src/client/api/todos.client";
import { useRouter } from "next/router";
import { PromiseUtils } from "@shared/utils/PromiseUtilts";
import React from "react";
import { CreateOrEditTodoPage } from "src/components/CreateOrEditTodoPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const todoClient = new TodoApiClient();

function CreateTodo() {
  const router = useRouter();

  return (
    <CreateOrEditTodoPage
      title={"Create Todo"}
      submitText="Create Todo"
      onSubmit={async (data) => {
        try {
          await todoClient.create(data);
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

export default withPageAuthRequired(CreateTodo);
