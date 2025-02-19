import Swal from "sweetalert2";

export const showToast = (message: string, icon: "success" | "error" | "warning" | "info") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#fff",
    color: "#333",
  });
};
