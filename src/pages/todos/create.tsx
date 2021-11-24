import {
  Button,
  Container,
  FormControl,
  Input,
  TextField,
  InputLabel,
  styled,
} from "@mui/material";
import { PageTitle } from "src/components/PageTitle";
import { useForm } from "react-hook-form";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { CustomButton } from "src/components/CustomButton";

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

export default function CreateTodo() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <Container className="pt-4">
      <div className="sm:px-40 px-0 ">
        <Link href="/" passHref>
          <Button
            variant="contained"
            className="bg-black hover:bg-gray-800 translate-x-[-100%] animate-slide-left"
          >
            <ArrowBackIcon />
            Back
          </Button>
        </Link>
      </div>

      <PageTitle title="Create Todo" center className="translate-x-[-140%] animate-slide-left" />
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
            {...register("title", { required: true })}
          />
        </FormControl>

        <FormControl
          variant="standard"
          className="translate-x-[-220%] animate-slide-left"
        >
          <StyledTextField
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
          Create Todo
        </Button>
      </form>
    </Container>
  );
}
