import styles from '../styles/MintPage.module.css';
function StampList ({ stampList }) {
  return (
    <div className={styles.grid}>
        {stampList.stampBoxList.length > 0 ? 
        stampList.stampBoxList.map(function(props) {
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