import { useRouter } from "next/router";
import { PromiseUtils } from "@shared/utils/PromiseUtilts";
import React from "react";
import { CreateOrEditTodoPage } from "src/components/CreateOrEditTodoPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { services } from "src/client/services";

function CreateTodo() {
  const router = useRouter();

  return (
    <CreateOrEditTodoPage
      title={"Create Todo"}
      submitText="Create"
      onSubmit={async (data) => {
        await PromiseUtils.delay(1000);
        await services.todos.create(data);
        router.push("/");
      }}
    />
  );
}

export default withPageAuthRequired(CreateTodo);
