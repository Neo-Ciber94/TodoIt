import { InferGetServerSidePropsType } from "next";
import TodoNote from "src/components/TodoNote";
import {
  Container,
  Box,
  CircularProgress,
  Button,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
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
import { animations } from "src/animations/springs";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  TodoFilters,
  TodosFiltersDrawer,
} from "src/components/TodosFilterDrawer";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { PageResult } from "@server/repositories/base/repository.base";
import { RequestConfig } from "src/client/http-client";
import { services } from "src/client/services";
import { NextSeo } from "next-seo";
import manifest from "public/manifest.json";
import { useForceUpdate } from "src/hooks/useForceUpdate";
import { useOrientation } from "src/hooks/useOrientation";

const PAGE_SIZE = 10;
const todoClient = services.todos;

type SearchTodoOptions = {
  page?: number;
  append?: true;
  delay?: number;
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

type Data = {
  pageResult: PageResult<ITodo>;
};

export const getServerSideProps = withPageAuthRequired<Data>({
  getServerSideProps: async ({ req }) => {
    const pageResult = await todoClient.getWithPagination(
      { pageSize: PAGE_SIZE },
      { headers: { cookie: req.headers.cookie || "" } }
    );
    return { props: { pageResult } };
  },
});

function Page({ pageResult }: PageProps) {
  const { data, totalPages } = pageResult;
  const [springs, _] = useSprings(3, (index) =>
    animations.slideLeftFadeIn(index * 100)
  );
  const [todos, setTodos] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const searchString = useDebounce(searchTerm, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [openFiltersMenu, setOpenFiltersMenu] = useState(false);
  const [page, setPage] = useState(1);
  const firstRender = useRef(true);
  const [todoFilters, setTodoFilters] = useState<TodoFilters>({});
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);
  const orientation = useOrientation();
  const rerender = useForceUpdate();

  useEffect(rerender, [orientation, rerender]);

  const NoTodosText = () => {
    if (data.length === 0) {
      return <CenterText text="No Todos" />;
    }

    if (todos.length === 0) {
      return <CenterText text="No Todos Found" />;
    }

    return <></>;
  };

  const onCloseFiltersMenu = () => setOpenFiltersMenu(false);

  const onDeleteTodo = async (todo: ITodo) => {
    try {
      await todoClient.delete(todo.id);
      const newTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(newTodos);
      rerender();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onToggleTodo = (todo: ITodo) => todoClient.toggle(todo.id);

  const onTodoClick = (todo: ITodo) => router.push(`/todos/edit/${todo.id}`);

  const fetchTodos = (options: SearchTodoOptions = {}) => {
    setIsLoading(true);

    // We abort the last request to keep the only the last data
    if (abortControllerRef.current) {
      abortControllerRef.current?.abort();
    }

    abortControllerRef.current = new AbortController();

    // prettier-ignore
    const opts = { page: options.page, pageSize: PAGE_SIZE, search: searchString };
    const config: RequestConfig = {
      signal: abortControllerRef.current.signal,
      params: { ...todoFilters },
    };

    const runAsync = async () => {
      try {
        if (options.delay && options.delay > 0) {
          await delayMs(options.delay); // FIXME: remove delay?
        }

        const newTodos = await todoClient.search(opts, config);

        options.append === true
          ? setTodos([...todos, ...newTodos.data])
          : setTodos(newTodos.data);

        if (options.page != null) {
          setPage(newTodos.currentPage);
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      } finally {
        setIsLoading(false);

        // Removes the abort controller
        abortControllerRef.current = null;
      }
    };

    //
    runAsync();
  };

  useEffect(() => {
    // Avoid make other request on first render
    if (firstRender.current === true) {
      firstRender.current = false;
      return;
    }

    fetchTodos();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchString, todoFilters]);

  return (
    <>
      <NextSeo title={manifest.name} description={manifest.description} />
      <Container className="pt-4">
        <div className="flex flex-row justify-start gap-2">
          <Link href="/todos/add" passHref>
            <animated.div style={springs[0]}>
              <Button
                variant="contained"
                color="primary"
                className={`bg-black w-full sm:w-auto`}
              >
                <AddIcon className="mr-2" />
                <span>New Todo</span>
              </Button>
            </animated.div>
          </Link>
          <animated.div style={springs[0]}>
            <Button
              variant="contained"
              color="primary"
              className={`bg-black w-full sm:w-auto`}
              onClick={() => setOpenFiltersMenu(true)}
            >
              <FilterListIcon />
            </Button>
          </animated.div>
        </div>
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
          inView={(isInView) => {
            if (isInView) {
              if (page < totalPages && !isLoading) {
                fetchTodos({
                  append: true,
                  page: page + 1,
                  delay: 1000,
                });
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
        filters={todoFilters}
        setFilters={(filters) => setTodoFilters(filters)}
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

function delayMs(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default Page;
