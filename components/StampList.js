import styles from '../styles/Global.module.css';
const StampList = ({ box }) => {
  return (
    <div className={styles.grid}>
        {box.stampList.length > 0 ? 
        box.stampList.map(function(props) {
            return (
                <div key={props.src} >
                    <img src={props.src} alt="Image cap" top width="100%"></img>
                </div>
            );
        })
        : ""}
    </div>
  );
};
 
export default StampList;