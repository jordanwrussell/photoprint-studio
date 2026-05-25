export async function POST(request) {
  try {
    const { orderId, amount, email } = await request.json();

    // Call Shopify API to create a checkout session
    // This is a placeholder - you'll need to implement actual Shopify integration
    // using the Shopify Storefront API or Admin API

    const shopifyResponse = await fetch(
      `${process.env.SHOPIFY_STORE_URL}/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation {
              checkoutCreate(input: {
                lineItems: [{
                  variantId: "${process.env.SHOPIFY_PRODUCT_VARIANT_ID}"
                  quantity: 1
                }]
              }) {
                checkout {
                  id
                  webUrl
                }
                checkoutUserErrors {
                  field
                  message
                }
              }
            }
          `,
        }),
      }
    );

    const shopifyData = await shopifyResponse.json();

    if (shopifyData.data?.checkoutCreate?.checkout) {
      const checkout = shopifyData.data.checkoutCreate.checkout;
      
      // Store order payment method info
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'shopify',
          metadata: JSON.stringify({ checkoutId: checkout.id }),
        }),
      });

      return Response.json({
        checkoutUrl: checkout.webUrl,
        checkoutId: checkout.id,
      });
    }

    return Response.json(
      { error: 'Failed to create Shopify checkout' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Shopify error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
