import React from "react";
import styles from "./Card.module.css"; // Importa los estilos CSS como un objeto de módulo
import { Link } from "react-router-dom";

const Card = ({ id, name, image, genres }) => {
  return (
    <div className={styles.card}>
      <img src={image} alt={name} className={styles.image} />
      <div className={styles.info}>
        <Link to={`/detail/${id}`}>
          <h2 className={styles.name}>{name}</h2>
        </Link>
        {genres && genres.length > 0 && (<p className={styles.genres}>
          <strong>Géneros:</strong> {genres.join(", ")}
        </p>)}
      </div>
    </div>
  );
};

export default Card;
