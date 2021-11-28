import { TodoForm } from "src/components/TodoForm";
import { Button, Container, IconButton } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import PaletteIcon from "@mui/icons-material/Palette";
import React, { useState } from "react";
import { ITodo } from "@shared/models/todo.model";

export interface CreateOrEditTodoPageProps {
  todo?: ITodo;
  onSubmit: (todo: Partial<ITodo>) => void;
  title: string;
  submitText: string;
}

export function CreateOrEditTodoPage({
  todo,
  onSubmit,
  title: pageTitleText,
  submitText: submitButtonText,
}: CreateOrEditTodoPageProps) {
  const [openColorPicker, setOpenColorPicker] = useState(false);

  return (
    <>
      <Container className="pt-4">
        <div className="sm:px-40 px-0 flex flex-row justify-between">
          <Link href="/" passHref>
            <Button
              variant="contained"
              className="bg-black hover:bg-gray-800 translate-x-[-100%] animate-slide-left"
            >
              <ArrowBackIcon />
              Back
            </Button>
          </Link>
          <IconButton
            title="Change Color"
            onClick={() => {
              setOpenColorPicker(true);
            }}
          >
            <PaletteIcon sx={{ color: "black" }} />
          </IconButton>
        </div>

        <PageTitle
          title={pageTitleText}
          center
          className="translate-x-[-140%] animate-slide-left"
        />
        <TodoForm
          initialValue={todo}
          buttonText={submitButtonText}
          openColorPicker={openColorPicker}
          onCloseColorPicker={() => setOpenColorPicker(false)}
          onSubmit={(data) => onSubmit(data)}
        />
      </Container>
    </>
  );
}
