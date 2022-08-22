// 'use strict';

// /**
//  *  booking controller
//  */

// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::booking.booking');

"use strict";

/**
 *  order controller
 */

const stripe = require("stripe")(
  "sk_test_51LXcJ6SEwMvWQwAObdPWUL4gn5uQMsnJSRvRwXvHj63IcN4U7IxnnSQgfHi75ZcGcpejHLbaFS4JYHrHzh8eH7fa00gpFl77H8"
);

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::booking.booking", ({ strapi }) => ({
  async create(ctx) {
    const {
      address,
      checkIn_Date,
      checkOut_Date,
      rooms_booked,
      state,
      amount,
      email,

      phone,
      name,
      token,
    } = ctx.request.body;

    // await stripe.charges.create({
    //   amount: amount,
    //   currency: "INR",
    //   source: token,
    //   description: `booking by user ${ctx.state.user.email}`,
    // });

    await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "INR",
      payment_method_types: ["card"],
    });

    const booking = await strapi.db.query("api::booking.booking").create({
      data: {
        address,
        checkIn_Date,
        checkOut_Date,
        rooms_booked,

        state,
        amount,
        email,

        phone,
        name,
        token,
        users: ctx.state.user.email,
      },
    });
    return booking;
  },
}));
