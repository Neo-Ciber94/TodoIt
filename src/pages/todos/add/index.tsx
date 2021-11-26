import { TodoForm } from "src/components/TodoForm";
import { TodoApiClient } from "src/client/api/todos.client";
import { Button, Container, IconButton, Drawer } from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import Link from "next/link";
import { PromiseUtils } from "@shared/utils/PromiseUtilts";
import PaletteIcon from "@mui/icons-material/Palette";
import React, { useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";

const todoClient = new TodoApiClient();

const COLORS = ["#FEF3C7", "#D1FAE5", "#FEE2E2", "#DBEAFE", "#FCE7F3"];

export default function CreateTodo() {
  const router = useRouter();
  const [openColorSelector, setOpenColorSelector] = useState(false);

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
              setOpenColorSelector(true);
            }}
          >
            <PaletteIcon sx={{ color: "black" }} />
          </IconButton>
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
              await todoClient.create(data);
              await PromiseUtils.delay(1000);
              router.push("/");
            } catch (e) {
              // TODO: Shows the error to the user
              console.error(e);
            }
          }}
        />
      </Container>
      <SelectColorDrawer
        colors={COLORS}
        open={openColorSelector}
        onClose={() => {
          setOpenColorSelector(false);
        }}
        onColorSelected={(color) => {
          console.log(color);
        }}
      />
    </>
  );
}

interface SelectColorDrawerProps {
  open: boolean;
  colors: string[];
  onClose?: () => void;
  onColorSelected: (color: string) => void;
}

function SelectColorDrawer(props: SelectColorDrawerProps) {
  const { open, colors, onClose, onColorSelected } = props;

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <div
        className="flex flex-row justify-center items-center bg-gray-800 p-8"
        style={{ height: "100%" }}
      >
        {colors.map((color) => (
          <IconButton
            key={color}
            onClick={() => {
              onColorSelected(color);
              if (onClose) {
                onClose();
              }
            }}
          >
            <CircleIcon
              sx={{
                color,
                fontSize: 70,
              }}
            />
          </IconButton>
        ))}
      </div>
    </Drawer>
  );
}
