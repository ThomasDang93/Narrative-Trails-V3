import Link from 'next/link';
import Image from 'next/image';
const Navbar = () => {
    return (
      <nav>
        <div className="logo">
          <Link href='/'>
            <a><Image src="/NT_logo1.png" width={268} height={51}/></a>
          </Link>
        </div>
        <Link href='/MintLetterBox'><a>Plant Letter Box</a></Link>
        <Link href='/MintStamp'><a>Make Stamp</a></Link>
        <Link href='/FindLetterbox'><a>Find Letterbox</a></Link>
        <Link href='/UsersCollection'><a>My Collection</a></Link>
      </nav>
    );
  };
   
  export default Navbar;