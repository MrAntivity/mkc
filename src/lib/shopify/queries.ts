/**
 * Example Storefront API GraphQL operations, ready to use once
 * src/lib/shopify/client.ts is connected to a real store. See that file for
 * setup steps. These are not called anywhere yet — the app runs on local
 * mock data (src/lib/garments.ts) until you wire them in.
 */

export const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      variants(first: 20) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Custom attributes (letters, color, font, placement, outline) can be passed
// per line via CartLineInput.attributes so order details survive into
// Shopify order line item properties, e.g.:
//
// {
//   merchandiseId: variantId,
//   quantity,
//   attributes: [
//     { key: "Letters", value: letters },
//     { key: "Letter Color", value: letterColorName },
//     { key: "Font", value: fontLabel },
//     { key: "Placement", value: placement },
//   ],
// }
