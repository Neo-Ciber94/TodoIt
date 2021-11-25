import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  CircularProgress,
  styled,
} from "@mui/material";
import { ITodo } from "@shared/models/todo.model";

export interface TodoViewProps {
  todo: ITodo;
}

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

export function TodoView({ todo }: TodoViewProps) {
  return (
    <Box className="flex flex-col sm:px-40 px-0">
      <FormControl
        variant="standard"
        className="mt-8 mb-2 translate-x-[-180%] animate-slide-left"
      >
        <StyledTextField
          label="Title"
          variant="standard"
          defaultValue={todo.title}
          disabled
        />
      </FormControl>

      <FormControl
        variant="standard"
        className="mt-8 mb-2 translate-x-[-220%] animate-slide-left"
      >
        <StyledTextField
          label="Content"
          defaultValue={todo.content}
          variant="outlined"
          multiline
          disabled
          minRows={4}
          maxRows={8}
        />
      </FormControl>
    </Box>
  );
}
