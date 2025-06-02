import { useEffect } from "react";
import styles from "./MovieModal.module.css";
import type { MovieModalProps } from "../../types/movie";

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    // scrollbar width calc and disable
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);

    return () => {
      // scrollbar restore
      document.body.style.overflow = originalOverflow || "auto";
      document.body.style.paddingRight = originalPaddingRight || "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const imageSrc = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";

  return (
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button className={styles.closeButton} aria-label="Close modal" onClick={onClose}>
          ×
        </button>
        <img src={imageSrc} alt={movie.title} className={styles.image} />
        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview || "No description"}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || "Unknown"}
          </p>
          {typeof movie.vote_average === "number" && (
            <p>
              <strong>Rating:</strong> {movie.vote_average}/10
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
