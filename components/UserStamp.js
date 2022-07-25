import Link from 'next/link';
function UserStamp ({ stamp }) {
  return (
    <div>
        {stamp.stampList.length > 0 ? 
            stamp.stampList.map(function(props) {
                return (
                    <div key={props.id}  >
                        <h1>{props.name} {" #"}{props.id}</h1>
                        <Link href={'/stamp/' + props.id} key={props.id}>
                            <img src={props.src} alt="Image cap" top width="100%"></img>
                        </Link>
                    </div>
                );
            })
            : ""}
    </div>
  );
};
 
export default UserStamp;