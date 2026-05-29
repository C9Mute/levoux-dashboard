exports.handler = async () => {
  try {
    const API_KEY = process.env.FINNHUB_API_KEY;

if (!API_KEY) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "FINNHUB_API_KEY missing"
    })
  };
}

    const generalResponse = await fetch(
    `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
);

const cryptoResponse = await fetch(
    `https://finnhub.io/api/v1/news?category=crypto&token=${API_KEY}`
);

const generalData = await generalResponse.json();
const cryptoData = await cryptoResponse.json();

console.log('GENERAL DATA:', generalData);
console.log('CRYPTO DATA:', cryptoData);
console.log('GENERAL IS ARRAY:', Array.isArray(generalData));
console.log('CRYPTO IS ARRAY:', Array.isArray(cryptoData));

const data = [
  ...cryptoData.slice(0, 5),
  ...generalData.slice(0, 10)
].sort((a, b) => b.datetime - a.datetime);

    const categorized = data.map(item => {

  const isCrypto = cryptoData.some(
    cryptoItem => cryptoItem.id === item.id
  );

  if (isCrypto) {
    return {
      ...item,
      category: 'crypto'
    };
  }

  const text = (
    (item.headline || '') + ' ' +
    (item.summary || '')
  ).toLowerCase();

  let category = 'stock';

      if (
  text.includes('bitcoin') ||
  text.includes('btc') ||
  text.includes('ethereum') ||
  text.includes('eth') ||
  text.includes('crypto') ||
  text.includes('xrp') ||
  text.includes('ripple') ||
  text.includes('solana') ||
  text.includes('sol') ||
  text.includes('dogecoin') ||
  text.includes('doge') ||
  text.includes('cardano') ||
  text.includes('ada') ||
  text.includes('binance') ||
  text.includes('bnb') ||
  text.includes('coinbase') ||
  text.includes('stablecoin') ||
  text.includes('usdt') ||
  text.includes('usdc')
) {
  category = 'crypto';
}
      else if (
        text.includes('eur') ||
        text.includes('usd') ||
        text.includes('jpy') ||
        text.includes('forex') ||
        text.includes('currency')
      ) {
        category = 'forex';
      }
      else if (
        text.includes('oil') ||
        text.includes('gold') ||
        text.includes('silver') ||
        text.includes('commodity') ||
        text.includes('futures')
      ) {
        category = 'futures';
      }

      return {
        ...item,
        category
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(categorized.slice(0, 8))
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
