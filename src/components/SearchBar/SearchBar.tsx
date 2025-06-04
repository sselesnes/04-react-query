import styles from "./SearchBar.module.css";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import type { SearchBarProps } from "../../types/movie";

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500); // Затримка, мс

  // Виклик onSubmit при зміні debouncedQuery
  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSubmit(debouncedQuery);
    }
  }, [debouncedQuery, onSubmit]);

  const handleSubmit = (formData: FormData) => {
    const inputQuery = formData.get("query") as string;
    if (!inputQuery.trim()) {
      toast.error("Будь ласка, введіть пошуковий запит.");
      return;
    }
    onSubmit(inputQuery);
    setQuery(""); // Очищення поля після відправки
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a
          className={styles.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={styles.form} action={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Пошук фільмів..."
            autoFocus
            value={query}
            onChange={handleInputChange}
          />
          <button className={styles.button} type="submit">
            Пошук
          </button>
        </form>
      </div>
    </header>
  );
}
