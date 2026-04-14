
'use client'
import { useState, useEffect, useRef, use } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { TransactionOutlined, HomeOutlined, CreditCardOutlined, CloseOutlined, MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Image from 'next/image';
import WalletConnect from './walletConnect';


type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: 'Home',
    key: '/',
    icon: <HomeOutlined />,
  },
  {
    label: 'Token',
    key: '/token',
    icon:<TransactionOutlined />,
  },
  {
    label: 'NFT',
    key: '/nft',
    icon: <CreditCardOutlined />,
  },
];


export default function Nav() {
  // return <h1>This is nav component</h1>
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    // setCurrent(e.key);
    router.push(e.key);
  };

  return (
    // <div>
    //   <Menu onClick={onClick} selectedKeys={[pathname ?? '/']} mode="horizontal" items={items} />
    // </div>
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      {/* 导航栏容器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo 区域（可自己替换） */}
          <div className="flex-shrink-0 flex items-center">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} />
          </div>

          {/* 桌面端菜单 - 隐藏在移动端 */}
          <div className="hidden md:block w-full flex items-center justify-end">
            <Menu
              onClick={onClick}
              selectedKeys={[pathname ?? '/']}
              mode="horizontal"
              items={items}
              className="border-none justify-start"
            />
          </div>

          {/* 钱包连接按钮 */}
          <div className="flex-shrink-0 flex items-center">
             <WalletConnect />
          </div>

          {/* 移动端汉堡按钮 - 只在移动端显示 */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端展开菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <Menu
              onClick={onClick}
              selectedKeys={[pathname ?? '/']}
              mode="vertical"
              items={items}
              className="border-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
