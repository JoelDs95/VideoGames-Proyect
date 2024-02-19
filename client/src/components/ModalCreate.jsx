import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createGame } from "../redux/actions";
import genresData from "./common/genresData";
import styles from "./ModalCreate.module.css"; // Importa los estilos del modal

const ModalCreate = ({ isOpen, closeModal }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showGenreList, setShowGenreList] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [image, setImage] = useState("");
  const [release, setRelease] = useState("");
  const [rating, setRating] = useState("");
  const dispatch = useDispatch();

  const toggleGenre = (genre) => {
    const index = selectedGenres.findIndex((g) => g.id === genre.id);
    if (index === -1) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g.id !== genre.id));
    }
  };

  const handleSubmit = async () => {
    try {
      const gameData = {
        name,
        description,
        platforms,
        image,
        release,
        rating,
        genres: selectedGenres.map((genre) => genre.id),
      };
      await dispatch(createGame(gameData));
      closeModal(); // Cierra el modal después de enviar el formulario
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
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
              </div>
              <div className={styles.formGroup}>
                <label>Descripción:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Plataformas:</label>
                <input
                  type="text"
                  value={platforms}
                  onChange={(e) => setPlatforms(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Imagen:</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className={styles.input}
                />
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
                <div className={styles.inputContainer}>
                  <label>Fecha de Lanzamiento:</label>
                  <input
                    type="date"
                    value={release}
                    onChange={(e) => setRelease(e.target.value)}
                    className={styles.inputDate}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <label>Rating:</label>
                  <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className={styles.inputDate}
                  />
                </div>
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
                  {showGenreList && (
                    <ul className={styles.genreList}>
                      {genresData.map((genre) => (
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