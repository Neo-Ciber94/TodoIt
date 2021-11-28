import { InferGetServerSidePropsType } from "next";
import TodoNote from "src/components/TodoNote";
import { Container, Box, CircularProgress, Button, Grow } from "@mui/material";
import React, { useEffect } from "react";
import { TodoApiClient } from "src/client/api/todos.client";
import { useDebounce } from "src/hooks/useDebounce";
import { ViewInterceptor } from "src/components/ViewInterceptor";
import { SearchTextField } from "src/components/SearchTextField";
import { MasonryGrid } from "src/components/MasonryGrid";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { PageTitle } from "src/components/PageTitle";
import { ITodo } from "@shared/models/todo.model";
import { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TransitionProps } from "@mui/material/transitions";
import { PASTEL_COLORS } from "@shared/config";

const PAGE_SIZE = 30;
const todoClient = new TodoApiClient();

type DialogTransitionProps = TransitionProps & {
  children: React.ReactElement<any, any>;
};

const Transition = React.forwardRef(function Transition(
  props: DialogTransitionProps,
  ref
) {
  return <Grow ref={ref} {...props} timeout={200} />;
});

export const getServerSideProps = async () => {
  const pageResult = await todoClient.getAll({
    pageSize: PAGE_SIZE,
  });
  return { props: { pageResult } };
};

function Page({
  pageResult,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, currentPage, totalPages } = pageResult;
  const hasMoreItems = currentPage < totalPages;

  //const swal = useSwal();
  const [todos, setTodos] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchString = useDebounce(searchTerm, 500);
  const [isMoreLoading, setIsMoreLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const firstRender = React.useRef(true);
  const [dialogColor, setDialogColor] = React.useState("");
  const [selectedTodo, setSelectedTodo] = React.useState<ITodo | null>(null);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDeleteTodo = React.useCallback(async (todo: ITodo) => {
    try {
      await todoClient.delete(todo.id);
      setTodos(todos.filter((t) => t.id !== todo.id));
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleTodo = React.useCallback(
    (todo: ITodo) => todoClient.toggle(todo.id),
    []
  );

  const onTodoClick = React.useCallback(
    (todo: ITodo) => router.push(`/todos/edit/${todo.id}`),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    // Avoid make other request on first render
    if (firstRender.current === true) {
      firstRender.current = false;
      return;
    }

    setIsLoading(true);
    const searchTodos = async () => {
      try {
        const result = await todoClient.search({
          search: searchString,
          pageSize: PAGE_SIZE,
        });
        setTodos(result.data);
      } finally {
        setIsLoading(false);
      }
    };

    //
    searchTodos();
  }, [searchString]);

  return (
    <Container className="pt-4 pb-16">
      <div className="flex flex-row justify-start">
        <Link href="/todos/add" passHref>
          <Button
            variant="contained"
            className="bg-black hover:bg-gray-800 translate-x-[-100%] animate-slide-left"
          >
            <AddIcon />
            New Todo
          </Button>
        </Link>
      </div>
      <PageTitle
        title="Todos"
        className="translate-x-[-140%] animate-slide-left"
        center
      />
      <div className="flex flex-row justify-center p-3 mb-4">
        <SearchTextField
          key={"search-input"}
          className="translate-x-[-180%] animate-slide-left"
          value={searchTerm}
          onSearch={setSearchTerm}
        />
      </div>
      {isLoading && <Loading />}
      <MasonryGrid>
        {todos.map((todo, index) => {
          return (
            <TodoNote
              key={todo.id}
              width="100%"
              delayIndex={index % 10}
              todo={todo}
              onDelete={onDeleteTodo}
              onToggle={onToggleTodo}
              onClick={onTodoClick}
            />
          );
        })}
      </MasonryGrid>
      <ViewInterceptor
        inView={async (inView) => {
          if (inView) {
            if (hasMoreItems && !isMoreLoading) {
              setIsMoreLoading(true);

              try {
                const newTodos = await todoClient.search({
                  search: searchString,
                  page: page + 1,
                  pageSize: PAGE_SIZE,
                });
                await new Promise((resolve) => setTimeout(resolve, 1000));

                setTodos([...todos, ...newTodos.data]);
                setPage(newTodos.currentPage);
              } catch (e) {
                console.error(e);
              } finally {
                setIsMoreLoading(false);
              }
            }
          }
        }}
      />

      {isMoreLoading && (
        <Box className="flex flex-row justify-center p-3 fixed bottom-0 left-0 right-0">
          <Loading />
        </Box>
      )}

      <DeleteTodoDialog
        open={open}
        onClose={handleClose}
        color={dialogColor}
        todo={selectedTodo!}
      />
    </Container>
  );
}

interface DeleteTodoDialogProps {
  open: boolean;
  todo: ITodo;
  color?: string;
  onClose: () => void;
}

function DeleteTodoDialog({
  open,
  onClose,
  todo,
  color,
}: DeleteTodoDialogProps) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={
        {
          // sx: {
          //   background: color,
          // },
        }
      }
    >
      <DialogTitle>Delete Todo?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`Are you sure about deleting `}
          <strong>{todo?.title}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          className="text-black hover:bg-black font-bold hover:bg-opacity-10"
        >
          Delete
        </Button>
        <Button
          onClick={onClose}
          className="text-black hover:bg-black font-bold hover:bg-opacity-10"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Loading() {
  return <CircularProgress color="inherit" className="text-black" />;
}

export default Page;
