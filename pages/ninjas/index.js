import styles from '../../styles/Jobs.module.css';
import Link from 'next/link';

export const getStaticProps = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    console.log(data)
    return {
      props: { ninjas: data }
    }
}
const Ninjas = ({ ninjas }) => {
    console.log(ninjas)
    return (
        <div>
            <h1>All Ninjas</h1>
            {ninjas.map(ninja => (
                <div key={ninja.id}>
                    <Link href={'/ninjas/' + ninja.id} key={ninja.id}>
                        <a className={styles.single}>
                            <h3>{ ninja.name }</h3>
                        </a>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default Ninjas;