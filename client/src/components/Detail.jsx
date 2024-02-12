import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDetails } from "../redux/actions";
import styles from "./Detail.module.css";


const Detail = ({ match }) => {
  const dispatch = useDispatch();
  const { id } = match.params;
  const details = useSelector((state) => state.detail);

  useEffect(() => {
    dispatch(getDetails(id));
  }, [dispatch, id]);

  if (details.loading) {
    return <div>Cargando detalles...</div>;
  }

  if (details.error) {
    return <div>Error: {details.error}</div>;
  }

  const backgroundImageStyle = {
    height: "calc(100vh - 20px)", // Altura de la ventana menos la altura de la barra de navegación (70px)
    backgroundImage: `linear-gradient(to bottom, rgba(150, 16, 16, 0), rgba(21, 21, 21)), linear-gradient(to bottom, rgba(21, 21, 21, 0.8), rgba(21, 21, 21, 0.5)), url(${details.image})`,
  };
  return (
    <div className={styles.page__art} style={backgroundImageStyle}>
      {" "}
      {/* Aplica la clase de estilo y los estilos de fondo */}
      <div
        className={styles.detailImage}
        style={{ backgroundImage: `url(${details.image})` }}
      />
      <div className={styles.detailContainer}>
      <h2 className={styles.detailTitle}>{details.name}</h2>
      <div className={styles.detailText} dangerouslySetInnerHTML={{ __html: details.description }} />
      <p className={styles.detailText}>Plataformas: {Array.isArray(details.platforms) ? details.platforms.join(", ") : ""}</p>
      <p className={styles.detailText}>Lanzamiento: {details.released}</p>
      <p className={styles.detailText}>Rating: {details.rating}</p>
      <p className={styles.detailText}>Géneros: {Array.isArray(details.genres) ? details.genres.join(", ") : ""}</p>
    </div>
    </div>
  );
};

export default Detail;
