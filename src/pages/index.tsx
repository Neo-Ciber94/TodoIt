import { InferGetServerSidePropsType } from "next";
import Masonry from "@mui/lab/Masonry";
import TodoNote from "src/components/TodoNote";
import { Container, Box, CircularProgress, Button } from "@mui/material";
import React, { useEffect } from "react";
import { TodoApiClient } from "src/client/api/todos.client";
import { useDebounce } from "src/hooks/useDebounce";
import { ViewInterceptor } from "src/components/ViewInterceptor";
import { SearchTextField } from "src/components/SearchTextField";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { PageTitle } from "src/components/PageTitle";
import { ITodo } from "@shared/models/todo.model";
import { useSwal } from "src/hooks/useSwal";

const todoClient = new TodoApiClient();

// Currently heights are hardcored
const HEIGHTS = [200, 300, 400, 200, 500, 200, 190, 200, 400, 200, 300];
const CLASS_COLORS = [
  "bg-yellow-100",
  "bg-green-100",
  "bg-red-100",
  "bg-blue-100",
  "bg-pink-100",
];

export const getServerSideProps = async () => {
  const pageResult = await todoClient.getAll();
  return { props: { pageResult } };
};

function Page({
  pageResult,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, currentPage, totalPages } = pageResult;
  const hasMoreItems = currentPage < totalPages;

  const [todos, setTodos] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchString = useDebounce(searchTerm, 500);
  const [isMoreLoading, setIsMoreLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const swal = useSwal();
  const firstRender = React.useRef(true);

  const onDeleteTodo = React.useCallback(async (todo: ITodo) => {
    const result = await swal.fire({
      title: "Delete Todo?",
      icon: "info",
      showCancelButton: true,
      customClass: {
        confirmButton: "bg-red-500 hover:bg-red-600",
      },
    });

    if (result.isConfirmed) {
      console.log("Deleted!! ", todo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onToggleTodo = React.useCallback(
    (todo: ITodo) => todoClient.toggle(todo.id),
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
        const result = await todoClient.search({ search: searchString });
        setTodos(result.data);
      } finally {
        setIsLoading(false);
      }
    };

    //
    searchTodos();
  }, [searchString]);

  return (
    <Container className="pt-4 pb-8">
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
      <Masonry columns={[1, 2, 3, 3, 4]} spacing={1}>
        {todos.map((todo, index) => {
          const { id } = todo;
          const colorIndex = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
          const colorClass = CLASS_COLORS[colorIndex % CLASS_COLORS.length];

          return (
            <TodoNote
              key={todo.id}
              delayIndex={index % 10}
              todo={todo}
              colorClass={colorClass}
              onDelete={onDeleteTodo}
              onToggle={onToggleTodo}
            />
          );
        })}
      </Masonry>
      <ViewInterceptor
        inView={async (inView) => {
          if (inView) {
            if (hasMoreItems && !isMoreLoading) {
              setIsMoreLoading(true);
              try {
                const newTodos = await todoClient.getAll({ page: page + 1 });
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setTodos([...todos, ...newTodos.data]);
                setPage(newTodos.currentPage);
              } finally {
                setIsMoreLoading(false);
              }
            }
          }
        }}
      />
      {isMoreLoading && (
        <Box className="flex flex-row justify-center p-3">
          <Loading />
        </Box>
      )}
    </Container>
  );
}

function Loading() {
  return <CircularProgress color="inherit" className="text-black" />;
}

export default Page;
