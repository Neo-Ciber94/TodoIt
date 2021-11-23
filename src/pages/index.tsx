import { InferGetServerSidePropsType } from "next";
import Masonry from "@mui/lab/Masonry";
import TodoNote from "src/components/TodoNote";
import {
  Container,
  Box,
  CircularProgress,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { styled } from "@mui/material/styles";
import { TodoApiClient } from "src/client/api/todos.client";
import { useDebounce } from "src/hooks/useDebounce";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from '@mui/icons-material/Menu';

const todoClient = new TodoApiClient();

// Currently heights are hardcored
const HEIGHTS = [200, 300, 400, 200, 500, 200, 190, 200, 400, 200, 300];

export const getServerSideProps = async () => {
  const pageResult = await todoClient.getAll();
  return { props: { pageResult } };
};

const StyledTextField = styled(TextField)({
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
  const { data, currentPage, totalPages } = pageResult;
  const hasMoreItems = currentPage < totalPages;

  const [todos, setTodos] = React.useState(data);
  const [searchTerm, setSearchTerm] = React.useState("");
  const searchString = useDebounce(searchTerm, 500);
  const [isMoreLoading, setIsMoreLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const firstRender = React.useRef(true);

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
    <div className="bg-orange-100">
      <ButtonAppBar />
      <Container className="pt-16 pb-8">
        <div className="flex flex-row justify-start">
          <Button
            color="inherit"
            variant="contained"
            className="text-white bg-gray-400 hover:bg-gray-500"
          >
            <AddIcon />
            New Note
          </Button>
        </div>
        <div className="flex flex-row justify-center">
          <h1 className="font-mono text-5xl">Todos</h1>
        </div>
        <div className="flex flex-row justify-center p-3 mb-4">
          <SearchTextField
            key={"search-input"}
            value={searchTerm}
            onSearch={setSearchTerm}
          />
        </div>
        {isLoading && <CircularProgress />}
        <Masonry columns={[1, 2, 3, 3, 4]} spacing={1}>
          {todos.map((todo, index) => (
            <TodoNote
              key={todo.id}
              delayIndex={index % 10}
              todo={todo}
              height={HEIGHTS[index % todos.length]}
            />
          ))}
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
            <CircularProgress color="primary" />
          </Box>
        )}
      </Container>
    </div>
  );
}

interface SearchTextFieldProps {
  value: string;
  onSearch: (term: string) => void;
}

function SearchTextField({ value, onSearch }: SearchTextFieldProps) {
  return (
    <StyledTextField
      label="Search"
      variant="standard"
      className="w-full md:w-1/2"
      value={value}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          onSearch(value);
        }
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
      }}
    />
  );
}

interface InterceptorProps {
  inView: (inView: boolean) => void;
}

const ViewInterceptor: React.FC<InterceptorProps> = (props) => {
  const { ref, inView } = useInView();
  const [wasInView, setWasInView] = React.useState(inView);

  useEffect(() => {
    if (inView != wasInView) {
      props.inView(inView);
      setWasInView(inView);
    }
  }, [props, inView, wasInView]);

  return <div ref={ref}></div>;
};

function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="bg-fuchsia-700">
        <Toolbar>
          <Button color="inherit" className="ml-auto">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Page;
