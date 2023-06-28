import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return <header>
        <div>
            <Link href="/">
                <img className="w-44 object-contain cursor-pointer" src="https://links.papareact.com/yvf" alt="Medium Logo"/>
            </Link>
        </div>
        <div></div>
    </header>;
}