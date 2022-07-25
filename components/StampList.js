import styles from '../styles/MintPage.module.css';
// import { Card, CardImg} from 'reactstrap';
function StampList ({ stampList }) {
  return (
    <div className={styles.grid}>
        {stampList.stampBoxList.length > 0 ? 
        stampList.stampBoxList.map(function(props) {
            return (
            <div key={props.src} >
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
 
export default StampList;