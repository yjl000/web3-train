import Link from "next/link"
export default function Page() {
  return(
  <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    This is NFT Page
    <button>
      <Link href="/">Go to Home Page</Link>
    </button>
  </div>
  )
}