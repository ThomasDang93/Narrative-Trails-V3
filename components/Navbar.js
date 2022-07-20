import Link from 'next/link';
import Image from 'next/image';
const Navbar = () => {
    return (
      <nav>
        <div className="logo">
          <Link href="/">
            <a><Image src="/logo.png" width={128} height={77}/></a>
          </Link>
        </div>
        <Link href="/"><a>Home</a></Link>
        <Link href="/test"><a>Test</a></Link>
      </nav>
    );
  };
   
  export default Navbar;