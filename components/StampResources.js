import styles from '../styles/Global.module.css';
const StampResources = ({ letterbox }) => {
  return (
    <div className={styles.grid}>
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
                <div key={props.id} >
                <img src={props.src} alt="Image cap" top width="100%"></img>
                </div>
            );
        })
        : ""}
    </div>
  );
};
 
export default StampResources;