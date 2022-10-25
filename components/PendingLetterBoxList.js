import Link from 'next/link';
const PendingLetterBoxList = ({ letterbox }) => {
  let filteredBoxes = letterbox.filter(letterbox => letterbox.image_uri !== null);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBoxes.length > 0  ? 
        filteredBoxes.map(function(props) {
            return (
              <div key={props.url_hash} className="grid grid-cols-1 gap-5">
                <div className="rounded overflow-hidden shadow-lg">
                    <Link href={'/pendingletterbox/' + props.url_hash} key={props.url_hash}>
                        <img src={props.image_uri} alt="Image cap" className="w-full hover" top width="100%"></img>
                    </Link>
                    <div className="p-4 py-4">
                      <h5 className="font-bold text-sm mb-2">{props.letterbox_name}</h5>
                    </div>
                </div>
              </div>
            );
        })
        : ""}
    </div>
  );
};
 
export default PendingLetterBoxList;