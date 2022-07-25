import styles from '../styles/MintPage.module.css';
function StampResources ({ letterbox }) {
  return (
    <div className={styles.grid}>
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
            <div key={props.id} >
              {/* <Card>
                  <CardImg top width="100%" src={ props.src} alt="Card image cap" />
              </Card> */}
              <img src={props.src} alt="Image cap" top width="100%"></img>
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default StampResources;