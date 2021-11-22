import { PageResult } from "@lib/repositories/base/repository";
import { InferGetServerSidePropsType } from "next";
import { ITodo } from "src/shared/todo.model";
import Masonry from "@mui/lab/Masonry";
import TodoNote from "src/components/TodoNote";
import { Container, Box, CircularProgress, TextField } from "@mui/material";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { styled } from "@mui/material/styles";

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

const CustomTextField = styled(TextField)({
  width: "50%",
  "& label.Mui-focused": {
    color: "gray",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "gray",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

function Page({
  pageResult,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: todos, currentPage, totalPages } = pageResult;
  const [isLoading, setIsLoading] = React.useState(false);
  const hasMoreItems = currentPage < totalPages;
  const [page, setPage] = React.useState(1);

  return (
    <div className="bg-orange-100">
      <Container sx={{ padding: 5, marginBottom: 5 }}>
        <div className="flex flex-row justify-center">
          <h1 className="font-mono text-5xl">Todos</h1>
        </div>
        <div className="flex flex-row justify-center p-3 mb-4">
          <CustomTextField
            label="Search"
            variant="standard"
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              console.log(e.target.value);
            }}
          />
        </div>
        <Masonry columns={[1, 2, 3, 4]} spacing={2}>
          {(todos || []).map((todo, index) => (
            <TodoNote
              key={todo.id}
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
    </div>
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
