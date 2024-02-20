import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGame, fetchGenres } from "../redux/actions";
import styles from "./ModalCreate.module.css"; // Importa los estilos del modal

const ModalCreate = ({ isOpen, closeModal }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showGenreList, setShowGenreList] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [image, setImage] = useState("");
  const [released, setReleased] = useState("");
  const [rating, setRating] = useState("");
  const dispatch = useDispatch();
  const genres = useSelector((state) => state.genres);

  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [imageError, setImageError] = useState("");
  const [releasedError, setReleasedError] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [genreError, setGenreError] = useState("");
  const [platformError, setPlatformError] = useState("");

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const toggleGenre = (genre) => {
    const index = selectedGenres.findIndex((g) => g.id === genre.id);
    if (index === -1) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g.id !== genre.id));
    }
  };

  const handleSubmit = async () => {
    setNameError("");
    setDescriptionError("");
    setImageError("");
    setReleasedError("");
    setRatingError("");
    setGenreError("");
    setPlatformError("");
    let hasErrors = false;
    if (name.trim() === "") {
      setNameError("El nombre es obligatorio");
      hasErrors = true;
    }
    if (name.length > 18) {
      setNameError("El nombre no puede tener más de 18 caracteres");
      hasErrors = true;
    }
    if (description.length > 250) {
      setDescriptionError("La descripción no puede tener más de 250 caracteres");
      hasErrors = true;
    }
    if (platforms.trim() === "") {
      setPlatformError("La plataforma es obligatoria");
      hasErrors = true;
    }
    if (!image.startsWith("https://")) {
      setImageError("La URL de la imagen debe empezar con 'https://'");
      hasErrors = true;
    }if (new Date(released) > new Date()) {
      setReleasedError("La fecha de lanzamiento no puede ser en el futuro");
      hasErrors = true;
    }
    if (parseFloat(rating) > 5 || isNaN(parseFloat(rating))) {
      setRatingError("El rating debe ser un número entre 0 y 5");
      hasErrors = true;
    }
    if (selectedGenres.length === 0) {
      setGenreError("Debe seleccionar al menos un género");
      hasErrors = true;
    }
    if (hasErrors) {
      return;
    }
    try {
      const gameData = {
        name,
        description,
        platforms,
        image,
        released,
        rating,
        genres: selectedGenres.map((genre) => genre.id),
      };
      await dispatch(createGame(gameData));
      closeModal(); // Cierra el modal después de enviar el formulario
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      alert("Error al enviar formulario");
    }
  };

  return (
    <div>
      {isOpen && (
        <div className={styles["modal-overlay"]} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Crear Nuevo Videojuego</h2>
            <div className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                />
                {nameError && <p className={styles.error}>{nameError}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Descripción:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.input}
                />
                {descriptionError && <p className={styles.error}>{descriptionError}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Plataformas:</label>
                <input
                  type="text"
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  className={styles.input}
                />
                {platformError && <p className={styles.error}>{platformError}</p>}
              </div>
              <div className={styles.formGroup}>
                <label>Imagen:</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={styles.input}
                />
                {imageError && <p className={styles.error}>{imageError}</p>}
                <br />
                <br />
                {image && (
                  <img
                    src={image}
                    alt="Imagen del juego"
                    className={styles.imagePreview}
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Géneros:</label>
                <div className={styles.multiselect}>
                  <input
                    type="text"
                    readOnly
                    value={selectedGenres.map((genre) => genre.name).join(", ")}
                    onClick={() => setShowGenreList(!showGenreList)}
                    className={styles.selectedGenres}
                  />
                  {genreError && <p className={styles.error}>{genreError}</p>}
                  {showGenreList && (
                    <ul className={styles.genreList}>
                      {genres.map((genre) => (
                        <li
                          key={genre.id}
                          className={
                            selectedGenres.some((g) => g.id === genre.id)
                              ? styles.selected
                              : ""
                          }
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <div className={styles.inputContainer}>
                  <label>Fecha de Lanzamiento:</label>
                  <input
                    type="date"
                    value={released}
                    onChange={(e) => setReleased(e.target.value)}
                    className={styles.inputDate}
                  />
                  {releasedError && <p className={styles.error}>{releasedError}</p>}
                </div>
                <div className={styles.inputContainer}>
                  <label>Rating:</label>
                  <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className={styles.inputDate}
                  />
                  {ratingError && <p className={styles.error}>{ratingError}</p>}
                </div>
              </div>
              <button onClick={handleSubmit} className={styles.submitButton}>
                Crear Juego
              </button>
            </div>
            {/* <button onClick={closeModal}>Cerrar Modal</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCreate;
