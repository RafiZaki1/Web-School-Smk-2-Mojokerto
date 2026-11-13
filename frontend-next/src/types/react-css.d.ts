import "react";

// Variabel CSS kustom (mis. "--i", "--z") dipakai di style inline pada banyak komponen.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
