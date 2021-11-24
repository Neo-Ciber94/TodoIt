import { TodoForm } from "src/components/TodoForm";
import { TodoApiClient } from "src/client/api/todos.client";
import { Button, Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import Link from "next/link";

const todoClient = new TodoApiClient();

export default function CreateTodo() {
  const router = useRouter();

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
        title="Create Todo"
        center
        className="translate-x-[-140%] animate-slide-left"
      />
      <TodoForm
        buttonText="Create Todo"
        onSubmit={async (data) => {
          try {
            const result = await todoClient.create(data);
            console.log("ADDED: ", result);
            router.push("/");
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </Container>
  );
}
