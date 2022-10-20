import { useRouter } from "next/router";

const FullName = ({ props }) => {
     const router = useRouter();
    console.log({props});
    console.log({router});

    return (
        <div>
            <b>Letterbox: </b> {router.query.slug[0]}
        </div>
    )
}
export default FullName;