import Link from 'next/link';
import Image from 'next/image';
const Navbar = () => {
    return (
      <nav>
        <div className="logo">
          <Link href='/'>
            <a><Image src="/logo.png" width={128} height={77}/></a>
          </Link>
        </div>
        <Link href='/plant-letter-box'><a>Plant Letter Box</a></Link>
        <Link href='/make-stamp'><a>Make Stamp</a></Link>
        <Link href='/find-letterbox'><a>Find Letterbox</a></Link>
        <Link href='/my-collection'><a>My Collection</a></Link>
        {/* <Link href="/ninjas"><a>Ninjas</a></Link> */}
      </nav>
    );
  };
   
  export default Navbar;