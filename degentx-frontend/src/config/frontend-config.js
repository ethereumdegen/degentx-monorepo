
  
import favicon from '@/assets/images/warp.gif'

const config = {
    title: 'Portfolio - ethereumdegen',
    tagline: '',
    url: 'https://ethereumdegen,com',
    baseURL: '/',
    favicon: favicon,
     


    navbar: {
        title: '',
        logo: {
          alt: 'Pepe Logo',
          src: 'assets/images/pepe_favicon.png',
        },
        items: [
         
          { to:'/', label:'Home' },
          { to:'/blog', label:'Blog' },
          { href:'https://opensea.io/collection/0xabdFb5eb2ac4d43dC18d8253494A6002A363effd', label:'Collection' },
    
          
        ],
    },

      accountMenu: {


          items: [
            {
              to:'/',
              label: 'Home'
            }


          ]
      },


    footer: {
        style: 'light',
        columns: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Blog',
                to: '/blog/',
              },

              {
                label: 'Contract',
                href:"https://etherscan.io/address/0x33941C7514bCC3f4dBa2305d55B4359efA915514"

              },

              {
                label: '0xBTC Info',
                href:"https://info.0xbitcoin.org"

              }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: '0xBitcoin.org',
                href: 'https://0xbitcoin.org',
              },
              {
                label: 'Discord',
                href: 'https://discord.com/invite/JGEqqmS',
              },
            ],
          },
          {
            title: 'More',
            items: [
             
              {
                label: 'GitHub',
                href: 'https://github.com/0xbitcoin',
              },
              { 
                label:'Collection' ,
                href:'https://opensea.io/collection/0xabdFb5eb2ac4d43dC18d8253494A6002A363effd'
             },
    
             
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} `,

        socials:{
          twitter:"https://twitter.com/0xbitcoin_erc20",
          github:"https://github.com/0xbitcoin"
        }
      }
    

}



export default config;
//module.exports = config;
