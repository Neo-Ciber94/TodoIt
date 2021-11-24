import { Button, FormControl, TextField, styled } from "@mui/material";
import { useForm } from "react-hook-form";

type FormData = {
  title: string;
  content?: string;
};

export interface TodoFormProps {
  initialValue?: FormData;
  buttonText: string;
  onSubmit: (data: FormData) => void;
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

export function TodoForm({
  onSubmit,
  buttonText,
  initialValue,
}: TodoFormProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col sm:px-40 px-0"
    >
      <FormControl
        variant="standard"
        className="translate-x-[-180%] animate-slide-left"
      >
        <StyledTextField
          variant="standard"
          label="Title"
          defaultValue={initialValue?.title}
          {...register("title", { required: true })}
        />
      </FormControl>

      <FormControl
        variant="standard"
        className="translate-x-[-220%] animate-slide-left"
      >
        <StyledTextField
          defaultValue={initialValue?.content}
          className="mt-8 mb-2"
          variant="outlined"
          label="Content"
          multiline
          rows={4}
          {...register("content")}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        className="text-white bg-black hover:bg-gray-800 mt-2 translate-x-[-260%] animate-slide-left"
      >
        {buttonText}
      </Button>
    </form>
  );
}
