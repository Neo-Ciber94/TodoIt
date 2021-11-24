import { TodoForm } from "src/components/TodoForm";
import { Button, Container } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

export default function CreateTodo() {
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
        onSubmit={(data) => {
          console.log(data);
        }}
      />
    </Container>
  );
}
