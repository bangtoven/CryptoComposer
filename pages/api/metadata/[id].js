// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const { id } = req.query;
  res.status(200).json({
    name: `Song #${id} on Crypto Composer`,
    description: `
      NFT representing a piece of music registered on blockchain
      https://crypto-composer.bangtoven.com/songs/${id}
    `,
    external_url: `https://crypto-composer.bangtoven.com/songs/${id}`,
    image: 'https://crypto-composer.bangtoven.com/hero.jpg',
  });
}
