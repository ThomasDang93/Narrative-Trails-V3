import styles from '../styles/MintPage.module.css';
import Link from 'next/link';
function LetterBoxList ({ letterbox }) {
  return (
    <div className={styles.grid}>
        {letterbox.letterBoxList.length > 0 ? 
        letterbox.letterBoxList.map(function(props) {
            return (
              <div key={props.id} className=" grid grid-cols-1 gap-5">
                <div className="rounded overflow-hidden shadow-lg">
                    <Link href={'/letterbox/' + props.id} key={props.id}>
                        <img src={props.src} alt="Image cap" className="w-full hover" top width="100%"></img>
                    </Link>
                    <div className="p-6 py-4">
                      <h5 className="font-bold text-xl mb-2">{props.name} {" #"}{props.id}</h5>
                      <p className="text-gray-700 text-base">{props.description}</p>
                    </div>
                </div>
              </div>
            );
        })
        : ""}
    </div>
  );
};
 
export default LetterBoxList;