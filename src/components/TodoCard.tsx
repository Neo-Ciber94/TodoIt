import { TodoDocument } from "@lib/models/todo.types";
import { AiOutlineClose } from "react-icons/ai";

type TodoCardProps = {
  todo: TodoDocument;
  onDelete: () => void;
  onComplete: () => void;
};

// Make a card with a title and a 'x' button, with the content in the middle and a button to complete in the bottom
export function TodoCard(props: TodoCardProps) {
  const { title, content, completed } = props.todo;

  return (
    <div className="p-4">
      <div className="flex-row">
        <h1>{title}</h1>
        <button onClick={props.onDelete}>
          <AiOutlineClose />
        </button>
      </div>
      <div>
        <p>{content}</p>
      </div>
      <button onClick={props.onComplete}></button>
    </div>
  );
}
