import { PageResult } from "@lib/repositories/base/repository";
import { InferGetServerSidePropsType } from "next";
import { ITodo } from "src/shared/todo.model";
import Masonry from "@mui/lab/Masonry";
import TodoNote from "src/components/TodoNote";
import { Container, Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const API_URL = "http://localhost:3000/api/todos";

export const getServerSideProps = async () => {
  const pageResult = await loadTodos(1);
  return { props: { pageResult } };
};

async function loadTodos(
  page: number,
  pageSize: number = 10
): Promise<PageResult<ITodo>> {
  const res = await fetch(`${API_URL}?page=${page}&pageSize=${pageSize}`);
  return await res.json();
}

const HEIGHTS = [200, 300, 400, 200, 500, 200, 190, 200, 400, 200, 300];

function Page({
  pageResult,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: todos, currentPage, totalPages } = pageResult;
  const [isLoading, setIsLoading] = React.useState(false);
  const hasMoreItems = currentPage < totalPages;
  const [page, setPage] = React.useState(1);

  return (
    <Container sx={{ padding: 5, marginBottom: 5 }}>
      <div className="flex flex-row justify-center">
        <h1 className="mb-4 font-mono text-5xl">Todos</h1>
      </div>
      <Masonry columns={[1, 2, 3, 4]} spacing={2}>
        {(todos || []).map((todo, index) => (
          <TodoNote
            key={todo._id}
            todo={todo}
            height={HEIGHTS[index % todos.length]}
          />
        ))}
      </Masonry>
      <EndOfPage
        onPageEnd={async () => {
          if (hasMoreItems && !isLoading) {
            setIsLoading(true);
            window.scrollTo({
              behavior: "smooth",
              top: document.body.scrollHeight,
            });

            try {
              const newTodos = await loadTodos(page + 1);
              await new Promise((resolve) => setTimeout(resolve, 1000));
              todos.push(...newTodos.data);
              console.log(todos);
              setPage(newTodos.currentPage);
            } finally {
              setIsLoading(false);
            }
          }
        }}
      />
      {isLoading && (
        <Box className="flex flex-row justify-center p-3">
          <CircularProgress color="primary" />
        </Box>
      )}
    </Container>
  );
}

interface EndOfPageProps {
  onPageEnd: () => void;
}

const EndOfPage: React.FC<EndOfPageProps> = (props) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      props.onPageEnd();
    }
  });

  return <div ref={ref}></div>;
};

export default Page;
