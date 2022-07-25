// import { Link } from 'react-router-dom';
// import { Card, CardImg, CardText, CardBody,
//   CardTitle, Button } from 'reactstrap';
import styles from '../styles/MintPage.module.css';
import Link from 'next/link';
function LetterBoxList ({ letterbox }) {
  return (
    <div className={styles.grid}>
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
            <div key={props.id} >
              {/* <Card>
                <Link to={`/letterbox/${props.id}`}>
                  <CardImg top width="100%" src={ props.src} alt="Card image cap" />
                </Link>
                <CardBody>
                    <CardTitle><h1>{props.name} {" #"}{props.id}</h1></CardTitle>
                    <CardText><b>Description: </b> {props.description}</CardText>
                  <Link to={`/letterbox/${props.id}`}>
                    <Button>View</Button>
                  </Link>
                </CardBody>
              </Card> */}
              <Link href={'/letterbox/' + props.id} key={props.id}>
                <img src={props.src} alt="Image cap" top width="100%"></img>
              </Link>
                
                <h1>{props.name} {" #"}{props.id}</h1>
                <b>Description: </b> {props.description}
            </div>
            );
        })
        : ""}

    </div>
  );
}
 
export default LetterBoxList;