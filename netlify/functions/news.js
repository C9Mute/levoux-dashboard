exports.handler = async () => {
  try {
    const API_KEY = process.env.FINNHUB_API_KEY;

    const response = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
    );

    const data = await response.json();

    const categorized = data.map(item => {
      const text = (
        (item.headline || '') + ' ' +
        (item.summary || '')
      ).toLowerCase();

      let category = 'stock';

      if (
        text.includes('bitcoin') ||
        text.includes('ethereum') ||
        text.includes('crypto')
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
      body: JSON.stringify(categorized.slice(0, 20))
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
