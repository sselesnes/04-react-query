import styles from "./App.module.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { FetchMoviesResponse, Movie } from "../../types/movie";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<null | Movie>(null);

  const { data, isLoading, error, isSuccess } = useQuery<FetchMoviesResponse>({
    queryKey: ["cached_movies", query, page],
    queryFn: () => fetchMovies({ query, page }),
    placeholderData: keepPreviousData,
  });

  if (error) {
    toast.error(error instanceof Error ? error.message : "An unknown error occurred");
  }

  const updateQuery = (newQuery: string) => {
    if (!newQuery.trim()) return;
    setQuery(newQuery);
    setPage(1);
  };

  const handleMovieSelect = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);

  const movies = (data as FetchMoviesResponse | undefined)?.results || [];
  const totalPages = (data as FetchMoviesResponse | undefined)?.total_pages || 0;

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={updateQuery} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={styles.pagination}
          activeClassName={styles.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {error && <ErrorMessage />}
      {data && movies.length > 0 && <MovieGrid movies={movies} onSelect={handleMovieSelect} />}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: { background: "#f40", color: "#fff" },
          error: { style: { background: "#f40", color: "#fff" } },
          success: { style: { background: "#2c7", color: "#fff" } },
        }}
      />
    </div>
  );
}
