import { InferGetServerSidePropsType } from "next";
import TodoNote from "src/components/TodoNote";
import {
  Container,
  Box,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { TodoApiClient } from "src/client/api/todos.client";
import { useDebounce } from "src/hooks/useDebounce";
import { ViewInterceptor } from "src/components/ViewInterceptor";
import { SearchTextField } from "src/components/SearchTextField";
import { MasonryGrid } from "src/components/MasonryGrid";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { ITodo } from "@shared/models/todo.model";
import { useRouter } from "next/router";
import { Center } from "src/components/Center";
import { useSprings, animated } from "react-spring";
import { animationSprings } from "src/animations/springs";
import FilterListIcon from "@mui/icons-material/FilterList";
import { TodosFiltersDrawer } from "src/components/TodosFilterDrawer";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const PAGE_SIZE = 30;
const todoClient = new TodoApiClient();

// export const getServerSideProps = withPageAuthRequired({
//   getServerSideProps: async () => {
//     const pageResult = await todoClient.getAll({
//       pageSize: PAGE_SIZE,
//     });
//     return { props: { pageResult } };
//   },
// });

export const getServerSideProps = async () => {
  const pageResult = await todoClient.getAll({
    pageSize: PAGE_SIZE,
  });
  return { props: { pageResult } };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function Page({ pageResult }: PageProps) {
  const { data, currentPage, totalPages } = pageResult;
  const hasMoreItems = currentPage < totalPages;
  const [springs, _] = useSprings(3, (index) =>
    animationSprings.slideLeftFadeIn(index * 100)
  );

  const [todos, setTodos] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchString = useDebounce(searchTerm, 500);
  const [isLoading, setIsLoading] = React.useState(false);
  const [openFiltersMenu, setOpenFiltersMenu] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const firstRender = React.useRef(true);
  const router = useRouter();

  const NoTodosText = () => {
    if (data.length === 0) {
      return <CenterText text="No Todos" />;
    }

    if (todos.length === 0) {
      return <CenterText text="No Todos Found" />;
    }

    return <></>;
  };

  const onCloseFiltersMenu = () => {
    setOpenFiltersMenu(false);
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
    <>
      <Container className="pt-4">
        <div className="flex flex-row justify-start gap-2">
          <Link href="/todos/add" passHref>
            <animated.div style={springs[0]}>
              <Button
                variant="contained"
                className={`bg-black hover:bg-gray-800 w-full sm:w-auto`}
              >
                <AddIcon className="mr-2" />
                <span>New Todo</span>
              </Button>
            </animated.div>
          </Link>
          <animated.div style={springs[0]}>
            <Button
              variant="contained"
              className={`bg-black hover:bg-gray-800 w-full sm:w-auto`}
              onClick={() => setOpenFiltersMenu(true)}
            >
              <FilterListIcon className="mr-4" />
              <span>Filter</span>
            </Button>
          </animated.div>
        </div>
        {/* <animated.div style={springs[1]}>
        <PageTitle title="Todos" center />
      </animated.div> */}
        <animated.div style={springs[2]}>
          <div className="flex flex-row justify-center p-3 mb-4">
            <SearchTextField
              key={"search-input"}
              value={searchTerm}
              onSearch={setSearchTerm}
            />
          </div>
        </animated.div>

        {!isLoading && <NoTodosText />}
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
              if (hasMoreItems && !isLoading) {
                setIsLoading(true);

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
                  setIsLoading(false);
                }
              }
            }
          }}
        />

        <Box
          className={`flex flex-row justify-center py-8 ${
            isLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          <Loading />
        </Box>
      </Container>
      <TodosFiltersDrawer
        open={openFiltersMenu}
        onClose={onCloseFiltersMenu}
        onFilters={(filters) => {
          console.log(filters);
        }}
      />
    </>
  );
}

interface CenterTextProps {
  text: string;
}

function CenterText({ text }: CenterTextProps) {
  return (
    <Center>
      <Typography
        variant="h4"
        sx={{
          userSelect: "none",
          opacity: 0.3,
        }}
      >
        {text}
      </Typography>
    </Center>
  );
}

function Loading() {
  return <CircularProgress color="inherit" className="text-black" />;
}

export default Page;
