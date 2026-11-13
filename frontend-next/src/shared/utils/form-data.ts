type FormValue = string | number | boolean | Blob | null | undefined | FormValue[] | { [key: string]: FormValue };

const isBlob = (value: unknown): value is Blob => typeof Blob !== "undefined" && value instanceof Blob;

// Ubah objek bersarang menjadi FormData ala Laravel:
// { gallery: [file, "/x.jpg"], testimonial: { quote } } -> gallery[0], gallery[1], testimonial[quote].
// Daftar kosong dikirim sebagai string kosong agar backend tahu isinya dihapus.
export function toFormData(values: object, form: FormData = new FormData(), prefix = ""): FormData {
  Object.entries(values as Record<string, FormValue>).forEach(([key, value]) => {
    const name = prefix ? `${prefix}[${key}]` : key;
    if (value === undefined) return;

    if (value === null) {
      form.append(name, "");
    } else if (isBlob(value)) {
      form.append(name, value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) form.append(name, "");
      value.forEach((item, index) => {
        const itemName = `${name}[${index}]`;
        if (isBlob(item)) {
          form.append(itemName, item);
        } else if (item !== null && typeof item === "object") {
          toFormData(item, form, itemName);
        } else {
          form.append(itemName, item === null || item === undefined ? "" : String(item));
        }
      });
    } else if (typeof value === "object") {
      toFormData(value, form, name);
    } else if (typeof value === "boolean") {
      form.append(name, value ? "1" : "0");
    } else {
      form.append(name, String(value));
    }
  });
  return form;
}
