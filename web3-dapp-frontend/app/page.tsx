import Link from "next/link";
import { Button } from 'antd';
import { TransactionOutlined, HomeOutlined, CreditCardOutlined } from '@ant-design/icons';
import Image from 'next/image';


export default function Home() {
  const items = [
    {
      title: 'ERC20 Token Standard',
      desc: 'ERC20 is a standard for fungible tokens on the Ethereum blockchain. It defines a common set of rules and functions that a token contract must implement, allowing for interoperability between different tokens and applications.',
      img: '/token.jpg',
    },
    {
      title: 'Non-Fungible Token (NFT) Standard',
      desc: 'NFTs are unique digital assets that represent ownership of a specific item or piece of content.',
      img: '/nft.jpg',
    },
    {
      title: 'Token Whitelisting',
      desc: 'Token whitelisting is a process of adding specific tokens to a list of approved tokens, usually for the purpose of enabling trading or other functionalities.',
      img: '/white-list.jpg',
    },
  ];
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full flex-col items-start justify-start py-32 px-16 bg-white dark:bg-black sm:items-start">
        <span className="flex w-full text-4xl font-bold justify-center h-auto">这是一个与智能合约交互的web应用</span>
        <div className="flex w-full justify-center mt-12">
          <Button type="primary" size="large" icon={<TransactionOutlined />}>
            <Link href="/token">Go to Token Page</Link>
          </Button>
          <Button type="default" size="large" icon={<CreditCardOutlined />} style={{ marginLeft: '20px' }}>
            <Link href="/nft">Go to NFT Page</Link>
          </Button>
        </div>

        <div className="w-full mt-16">
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0">
            {/* 核心：items.map 循环 */}
            {items.map((item, index) => (
              <li 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 
                          transition-all duration-300 ease-out
                          hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                {/* 图片（来自 public 文件夹） */}
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  {item.title}
                </h3>

                {/* 描述 */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
        
      </main>
    </div>
  );
}
