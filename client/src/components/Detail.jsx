import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { getDetails } from "../redux/actions";
import styles from "./Detail.module.css";


const Detail = ({ match }) => {
  const dispatch = useDispatch();
  const { id } = match.params;
  const details = useSelector(state => state.detail);
  const history = useHistory();

  useEffect(() => {
    dispatch(getDetails(id));
  }, [dispatch, id]);
 
  const handleGoBack = () => {
  history.push({
    pathname: '/home', 
  });
};
  const backgroundImage = {
    height: "calc(100vh - 20px)",
    backgroundImage: `linear-gradient(to bottom, rgba(150, 16, 16, 0), rgba(21, 21, 21)), linear-gradient(to bottom, rgba(21, 21, 21, 0.8), rgba(21, 21, 21, 0.5)), url(${details.image})`,
  };
  return (
    
    <div className={styles.page__art} style={backgroundImage}>
      <button className={styles.returnButton} onClick={handleGoBack}>Home</button>
      <div
        className={styles.detailImage}
        style={{ backgroundImage: `url(${details.image})` }}
      />
      <div className={styles.detailContainer}>
      <h2 className={styles.detailTitle}>{details.name}</h2>
      <div className={styles.detailText} dangerouslySetInnerHTML={{ __html: details.description }} />
      <p className={styles.detailText}><strong>Plataformas:</strong> {Array.isArray(details.platforms) ? details.platforms.join(", ") : ""}</p>
      <p className={styles.detailText}><strong>Lanzamiento:</strong> {details.released}</p>
      <p className={styles.detailText}><strong>Rating:</strong> {details.rating}</p>
      <p className={styles.detailText}><strong>Géneros:</strong> {Array.isArray(details.genres) ? details.genres.join(", ") : ""}</p>
    </div>
    </div>
  );
};

export default Detail;
