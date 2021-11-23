import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

type AwaitedType<T> = T extends Promise<infer U> ? U : T;

const CustomSwal = withReactContent(Swal);

interface SwalHook {
  fire<T = any>(
    options: SweetAlertOptions
  ): Promise<SweetAlertResult<AwaitedType<T>>>;
  fire<T = any>(
    title: string,
    text?: string,
    icon?: SweetAlertIcon
  ): Promise<SweetAlertResult<AwaitedType<T>>>;
}

export function useSwal(): SwalHook {
  return {
    fire<T = any>(
      titleOrOptions: string | SweetAlertOptions,
      text?: string,
      icon?: SweetAlertIcon
    ): Promise<SweetAlertResult<AwaitedType<T>>> {
      if (typeof titleOrOptions === "string") {
        return CustomSwal.fire<T>(titleOrOptions, text, icon);
      } else {
        return CustomSwal.fire<T>(titleOrOptions);
      }
    },
  };
}
